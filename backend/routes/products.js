const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticateAdmin } = require("../middleware/auth");

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, featured, popular, status } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += " AND p.category_id = ?";
      params.push(category);
    }
    if (featured === "true") {
      query += " AND p.is_featured = TRUE";
    }
    if (popular === "true") {
      query += " AND p.is_popular = TRUE";
    }
    if (status) {
      query += " AND p.status = ?";
      params.push(status);
    } else {
      query += ' AND p.status = "active"';
    }

    query += " ORDER BY p.created_at DESC";

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(products[0]);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create product (Admin only)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      image_url,
      is_featured,
      is_popular,
      stock_quantity,
      status,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const [result] = await db.query(
      `INSERT INTO products 
       (name, description, price, category_id, image_url, is_featured, is_popular, stock_quantity, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        category_id || null,
        image_url || null,
        is_featured || false,
        is_popular || false,
        stock_quantity || 0,
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product (Admin only)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      image_url,
      is_featured,
      is_popular,
      stock_quantity,
      status,
    } = req.body;

    const [result] = await db.query(
      `UPDATE products SET 
       name = ?, description = ?, price = ?, category_id = ?, 
       image_url = ?, is_featured = ?, is_popular = ?, 
       stock_quantity = ?, status = ?
       WHERE id = ?`,
      [
        name,
        description,
        price,
        category_id,
        image_url,
        is_featured,
        is_popular,
        stock_quantity,
        status,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product (Admin only)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
