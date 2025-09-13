const express = require("express");
const router = express.Router();
const { authRequired } = require("../controller/auth");
const { startPayment, webhook } = require("../controller/payment");

// เริ่มการจ่าย (ต้อง login)
router.post("/start", authRequired, startPayment);

// Webhook จาก Omise (อย่าลืมเปิด public URL เช่น ngrok)
router.post("/webhook", express.json(), webhook);

module.exports = router;
