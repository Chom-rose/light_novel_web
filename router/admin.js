const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
res.json({ ok: true, time: new Date().toISOString() });
});


module.exports = router;
