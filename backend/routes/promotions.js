const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticateAdmin } = require("../middleware/auth");

// Get all promotions
router.get("/", async (req, res) => {
  try {
    const { active } = req.query;

    let query = `
      SELECT p.*, pr.name as product_name 
      FROM promotions p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE 1=1
    `;
    const params = [];

    if (active === "true") {
      query +=
        " AND p.is_active = TRUE AND p.start_date <= NOW() AND p.end_date >= NOW()";
    }

    query += " ORDER BY p.created_at DESC";

    const [promotions] = await db.query(query, params);
    res.json(promotions);
  } catch (error) {
    console.error("Get promotions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get promotion by ID
router.get("/:id", async (req, res) => {
  try {
    const [promotions] = await db.query(
      `SELECT p.*, pr.name as product_name 
       FROM promotions p
       LEFT JOIN products pr ON p.product_id = pr.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (promotions.length === 0) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json(promotions[0]);
  } catch (error) {
    console.error("Get promotion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Validate promotion code
router.post("/validate", async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Promotion code is required" });
    }

    const [promotions] = await db.query(
      `SELECT * FROM promotions 
       WHERE code = ? 
       AND is_active = TRUE 
       AND start_date <= NOW() 
       AND end_date >= NOW()`,
      [code.toUpperCase()]
    );

    if (promotions.length === 0) {
      return res
        .status(404)
        .json({ message: "Invalid or expired promotion code" });
    }

    const promotion = promotions[0];

    // Check minimum purchase
    if (totalAmount < promotion.min_purchase) {
      return res.status(400).json({
        message: `Minimum purchase of $${promotion.min_purchase} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promotion.discount_type === "percentage") {
      discountAmount = (totalAmount * promotion.discount_value) / 100;
    } else {
      discountAmount = promotion.discount_value;
    }

    res.json({
      valid: true,
      promotion: {
        id: promotion.id,
        title: promotion.title,
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value,
        discount_amount: discountAmount,
      },
    });
  } catch (error) {
    console.error("Validate promotion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create promotion (Admin only)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      code,
      product_id,
      min_purchase,
      is_active,
    } = req.body;

    if (
      !title ||
      !discount_type ||
      !discount_value ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO promotions 
       (title, description, discount_type, discount_value, start_date, end_date, code, product_id, min_purchase, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        discount_type,
        discount_value,
        start_date,
        end_date,
        code ? code.toUpperCase() : null,
        product_id || null,
        min_purchase || 0,
        is_active !== undefined ? is_active : true,
      ]
    );

    res.status(201).json({
      message: "Promotion created successfully",
      promotionId: result.insertId,
    });
  } catch (error) {
    console.error("Create promotion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update promotion (Admin only)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      code,
      product_id,
      min_purchase,
      is_active,
    } = req.body;

    const [result] = await db.query(
      `UPDATE promotions SET 
       title = ?, description = ?, discount_type = ?, discount_value = ?, 
       start_date = ?, end_date = ?, code = ?, product_id = ?, 
       min_purchase = ?, is_active = ?
       WHERE id = ?`,
      [
        title,
        description,
        discount_type,
        discount_value,
        start_date,
        end_date,
        code ? code.toUpperCase() : null,
        product_id,
        min_purchase,
        is_active,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json({ message: "Promotion updated successfully" });
  } catch (error) {
    console.error("Update promotion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete promotion (Admin only)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM promotions WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
