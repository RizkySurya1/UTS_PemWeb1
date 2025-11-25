const express = require("express");
const router = express.Router();
const db = require("../db");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { bandName, email, username, password } = req.body;

    if (!bandName || !email || !username || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek email / username sudah ada
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email atau Username sudah terdaftar" });
    }

    // Insert user baru
    await db.query(
      "INSERT INTO users (band_name, email, username, password) VALUES (?, ?, ?, ?)",
      [bandName, email, username, password] // NOTE: di real app pakai hash
    );

    return res.status(201).json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error("Error register:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Email/Username dan password wajib diisi" });
    }

    const [rows] = await db.query(
      "SELECT id, band_name, email, username, password FROM users WHERE (email = ? OR username = ?) LIMIT 1",
      [emailOrUsername, emailOrUsername]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const user = rows[0];

    // Sederhana: bandingkan langsung (real app: hash compare)
    if (user.password !== password) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Jangan kirim password ke client
    delete user.password;

    return res.json({
      message: "Login berhasil",
      user,
    });
  } catch (err) {
    console.error("Error login:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;
