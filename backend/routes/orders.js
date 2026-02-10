const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD${timestamp}${random}`;
}

// Get all orders (Admin only)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const { status, type, limit } = req.query;

    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email,
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }
    if (type) {
      query += " AND o.order_type = ?";
      params.push(type);
    }

    query += " GROUP BY o.id ORDER BY o.created_at DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    const [orders] = await db.query(query, params);
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's orders
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get order by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
              p.title as promotion_title, p.discount_type, p.discount_value
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN promotions p ON o.promotion_id = p.id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];

    // Check authorization (user can only see their own orders, admin can see all)
    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get order items
    const [items] = await db.query(
      `SELECT oi.*, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    order.items = items;
    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create order (Online order)
router.post("/", async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      user_id,
      customer_name,
      customer_phone,
      customer_email,
      items,
      promotion_id,
      notes,
    } = req.body;

    if (!customer_name || !customer_phone || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND status = "active"',
        [item.product_id]
      );

      if (products.length === 0) {
        throw new Error(`Product ${item.product_id} not found or inactive`);
      }

      const product = products[0];
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal: subtotal,
      });
    }

    // Apply promotion if provided
    let discountAmount = 0;
    if (promotion_id) {
      const [promotions] = await connection.query(
        `SELECT * FROM promotions 
         WHERE id = ? 
         AND is_active = TRUE 
         AND start_date <= NOW() 
         AND end_date >= NOW()`,
        [promotion_id]
      );

      if (promotions.length > 0) {
        const promotion = promotions[0];
        if (totalAmount >= promotion.min_purchase) {
          if (promotion.discount_type === "percentage") {
            discountAmount = (totalAmount * promotion.discount_value) / 100;
          } else {
            discountAmount = promotion.discount_value;
          }
        }
      }
    }

    const finalAmount = totalAmount - discountAmount;
    const orderNumber = generateOrderNumber();

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (order_number, user_id, customer_name, customer_phone, customer_email, 
        total_amount, discount_amount, final_amount, promotion_id, order_type, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'online', ?)`,
      [
        orderNumber,
        user_id || null,
        customer_name,
        customer_phone,
        customer_email || null,
        totalAmount,
        discountAmount,
        finalAmount,
        promotion_id || null,
        notes || null,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, product_name, product_price, quantity, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
          item.subtotal,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Order created successfully",
      orderId: orderId,
      orderNumber: orderNumber,
      finalAmount: finalAmount,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  } finally {
    connection.release();
  }
});

// Create POS order (Admin only)
router.post("/pos", authenticateAdmin, async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { customer_name, customer_phone, items, promotion_id, notes } =
      req.body;

    if (!customer_name || !customer_phone || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT id, name, price FROM products WHERE id = ? AND status = "active"',
        [item.product_id]
      );

      if (products.length === 0) {
        throw new Error(`Product ${item.product_id} not found or inactive`);
      }

      const product = products[0];
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal: subtotal,
      });
    }

    // Apply promotion
    let discountAmount = 0;
    if (promotion_id) {
      const [promotions] = await connection.query(
        `SELECT * FROM promotions 
         WHERE id = ? 
         AND is_active = TRUE 
         AND start_date <= NOW() 
         AND end_date >= NOW()`,
        [promotion_id]
      );

      if (promotions.length > 0) {
        const promotion = promotions[0];
        if (totalAmount >= promotion.min_purchase) {
          if (promotion.discount_type === "percentage") {
            discountAmount = (totalAmount * promotion.discount_value) / 100;
          } else {
            discountAmount = promotion.discount_value;
          }
        }
      }
    }

    const finalAmount = totalAmount - discountAmount;
    const orderNumber = generateOrderNumber();

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (order_number, customer_name, customer_phone, 
        total_amount, discount_amount, final_amount, promotion_id, order_type, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pos', 'completed', ?)`,
      [
        orderNumber,
        customer_name,
        customer_phone,
        totalAmount,
        discountAmount,
        finalAmount,
        promotion_id || null,
        notes || null,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, product_name, product_price, quantity, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
          item.subtotal,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "POS order created successfully",
      orderId: orderId,
      orderNumber: orderNumber,
      finalAmount: finalAmount,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create POS order error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  } finally {
    connection.release();
  }
});

// Update order status (Admin only)
router.patch("/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get order statistics (Admin only)
router.get("/stats/dashboard", authenticateAdmin, async (req, res) => {
  try {
    // Total orders
    const [totalOrders] = await db.query(
      "SELECT COUNT(*) as count FROM orders"
    );

    // Total revenue
    const [totalRevenue] = await db.query(
      'SELECT SUM(final_amount) as total FROM orders WHERE status != "cancelled"'
    );

    // Orders by status
    const [ordersByStatus] = await db.query(
      "SELECT status, COUNT(*) as count FROM orders GROUP BY status"
    );

    // Recent orders
    const [recentOrders] = await db.query(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    res.json({
      totalOrders: totalOrders[0].count,
      totalRevenue: totalRevenue[0].total || 0,
      ordersByStatus: ordersByStatus,
      recentOrders: recentOrders,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
