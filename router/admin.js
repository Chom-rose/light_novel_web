const express = require("express");
const router = express.Router();
const { authRequired } = require("../controller/auth");
const db = require("../db/db");

router.get("/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

router.get("/users", authRequired, (req, res) => {
  db.all("SELECT id, username, email, age FROM users", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
