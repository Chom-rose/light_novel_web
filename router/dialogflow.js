const express = require("express");
const router = express.Router();
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

// client ใช้ key json ที่คุณโหลดมา
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "keys/dialogflow-key.json",
});

const projectId = "the-utility-472408-c6"; // เปลี่ยนเป็น project ID จริงของคุณ

// endpoint: รับข้อความจาก user แล้วส่งไปที่ Dialogflow
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "th-TH",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      query: message,
      reply: result.fulfillmentText || "ขอโทษครับ ฉันไม่เข้าใจ",
    });
  } catch (err) {
    console.error("Dialogflow error:", err);
    res.status(500).json({ error: "Dialogflow error" });
  }
});

module.exports = router;
