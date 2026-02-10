const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticateAdmin } = require("../middleware/auth");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM categories ORDER BY name"
    );
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [req.params.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create category (Admin only)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const [result] = await db.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertId,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update category (Admin only)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const [result] = await db.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete category (Admin only)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
