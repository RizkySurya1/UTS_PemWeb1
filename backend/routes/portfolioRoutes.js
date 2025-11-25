const express = require("express");
const router = express.Router();
const db = require("../db");

// GET semua portfolio milik user tertentu
// GET /api/portfolio?userId=1
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId wajib diisi" });
    }

    const [rows] = await db.query(
      "SELECT id, title, description, type, file_name AS fileName, created_at AS createdAt FROM portfolio_items WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Error get portfolio:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// POST buat item baru
router.post("/", async (req, res) => {
  try {
    const { userId, title, description, type, fileName } = req.body;

    if (!userId || !title || !type) {
      return res
        .status(400)
        .json({ message: "userId, title, dan type wajib diisi" });
    }

    const validTypes = ["photo", "song", "video"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Tipe tidak valid" });
    }

    const [result] = await db.query(
      "INSERT INTO portfolio_items (user_id, title, description, type, file_name) VALUES (?, ?, ?, ?, ?)",
      [userId, title, description || "", type, fileName || null]
    );

    return res.status(201).json({
      message: "Portofolio berhasil dibuat",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error create portfolio:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// PUT update item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, fileName } = req.body;

    const [existing] = await db.query(
      "SELECT id FROM portfolio_items WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    await db.query(
      "UPDATE portfolio_items SET title = ?, description = ?, type = ?, file_name = ? WHERE id = ?",
      [title, description, type, fileName, id]
    );

    return res.json({ message: "Portofolio berhasil diupdate" });
  } catch (err) {
    console.error("Error update portfolio:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      "SELECT id FROM portfolio_items WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    await db.query("DELETE FROM portfolio_items WHERE id = ?", [id]);

    return res.json({ message: "Portofolio berhasil dihapus" });
  } catch (err) {
    console.error("Error delete portfolio:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;
