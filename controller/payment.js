const omise = require("omise")({
  secretKey: process.env.OMISE_SECRET_KEY,
  publicKey: process.env.OMISE_PUBLIC_KEY,
});
const db = require("../db/db");
const crypto = require("crypto");

exports.startPayment = async (req, res) => {
  try {
    if (!process.env.OMISE_PUBLIC_KEY || !process.env.OMISE_SECRET_KEY) {
      return res.status(500).json({ error: "Omise keys not configured" });
    }
   
  } catch (err) {
    console.error("[startPayment] error:", err);
    res.status(500).json({ error: err?.message || "Payment error" });
  }
};


// ✅ สร้าง source ก่อน แล้วค่อย charge เพื่อได้ QR ชัวร์ ๆ
exports.startPayment = async (req, res) => {
  try {
    const userId = req.user.id;          // จาก token (authRequired)
    const amount = 9900;                  // 99.00 THB -> หน่วยสตางค์
    const currency = "thb";

    // 1) Create source (promptpay)
    const source = await omise.sources.create({
      type: "promptpay",
      amount,
      currency,
    });

    // 2) Create charge with that source
    const charge = await omise.charges.create({
      amount,
      currency,
      source: source.id,
      metadata: { user_id: userId },
    });

    // ปกติจะมีรูป QR ที่ charge.source.scannable_code.image.download_uri
    const qrImage =
      charge?.source?.scannable_code?.image?.download_uri ||
      source?.scannable_code?.image?.download_uri ||
      null;

    if (!qrImage) {
      // เปิดเผยข้อความดี ๆ ให้ debug ง่าย
      return res
        .status(500)
        .json({ error: "สร้าง QR ไม่สำเร็จ", debug: { charge, source } });
    }

    res.json({
      qrImage,
      chargeId: charge.id,
      status: charge.status, // pending (ปกติ)
    });
  } catch (err) {
    console.error("[startPayment] error:", err);
    res.status(500).json({ error: err.message });
  }
};


function verifyOmiseSignature(_req) {
  return true;
}

exports.webhook = (req, res) => {
  if (!verifyOmiseSignature(req)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = req.body;

  if (event.key === "charge.complete") {
    const data = event.data;
    const userId = data?.metadata?.user_id;

    // บันทึก payment
    db.run(
      `INSERT INTO payments (user_id, charge_id, amount, currency, status)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, data.id, data.amount, data.currency, data.status],
      (err) => err && console.error("DB insert error:", err.message)
    );

    // อัปเกรดพรีเมียมเมื่อจ่ายสำเร็จ
    if (data.status === "successful") {
      db.run("UPDATE users SET is_premium = 1 WHERE id = ?", [userId], (err) => {
        if (err) console.error("DB update error:", err.message);
      });
    }
  }

  res.json({ received: true });
};
