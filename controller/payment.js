const omise = require("omise")({
    secretKey: process.env.OMISE_SECRET_KEY,
    publicKey: process.env.OMISE_PUBLIC_KEY,
});
const db = require("../db/db");
const crypto = require("crypto");

// ======================
// 📌 สร้าง QR สำหรับชำระเงิน
// ======================
exports.startPayment = async (req, res) => {
    try {
        const userId = req.user.id; // จาก token
        const amount = 9900; // 99 บาท (หน่วยสตางค์)

        const charge = await omise.charges.create({
            amount,
            currency: "thb",
            source: { type: "promptpay" },
            metadata: { user_id: userId },
        });

        res.json({
            qrImage: charge.source.scannable_code.image.download_uri,
            chargeId: charge.id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

function verifyOmiseSignature(req) {
    return true;

    // ถ้าอยากตรวจจริง ใช้โค้ดนี้แทน:
    /*
    const signature = req.headers["x-omise-signature"];
    const rawBody = JSON.stringify(req.body);
    const computed = crypto
      .createHmac("sha256", process.env.OMISE_SECRET_KEY)
      .update(rawBody, "utf8")
      .digest("base64");
    return signature === computed;
    */
}

// ======================
// 📌 Webhook Handler
// ======================
exports.webhook = (req, res) => {
    if (!verifyOmiseSignature(req)) {
        return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body; // ใช้ JSON ตรง ๆ (เพราะ express.json() parse ให้แล้ว)

    if (event.key === "charge.complete") {
        const data = event.data;
        const userId = data.metadata.user_id;

        // บันทึก payment
        db.run(
            `INSERT INTO payments (user_id, charge_id, amount, currency, status)
         VALUES (?, ?, ?, ?, ?)`,
            [userId, data.id, data.amount, data.currency, data.status],
            (err) => {
                if (err) console.error("DB insert error:", err.message);
            }
        );

        // อัปเดต premium
        if (data.status === "successful") {
            db.run("UPDATE users SET is_premium = 1 WHERE id = ?", [userId], (err) => {
                if (err) console.error("DB update error:", err.message);
            });
        }
    }

    res.json({ received: true });
};  