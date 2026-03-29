import { Router, type Request, type Response } from "express";
import { WhatsAppIngestionService } from "../services/whatsappIngestionService.js";

const router = Router();

// POST /api/whatsapp/webhook – Twilio incoming message webhook
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const { From, To, Body, NumMedia, MediaUrl0, SmsMessageSid } = req.body;

    if (!From || !Body) {
      return res.status(400).send("<Response></Response>");
    }

    const mediaUrls: string[] = [];
    if (NumMedia && parseInt(NumMedia) > 0 && MediaUrl0) {
      mediaUrls.push(MediaUrl0);
    }

    const result = await WhatsAppIngestionService.processIncomingMessage({
      from: From,
      to: To,
      body: Body,
      mediaUrls,
      twilioSid: SmsMessageSid,
    });

    // Reply via TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${result.replyMessage}</Message>
</Response>`;

    res.setHeader("Content-Type", "text/xml");
    res.send(twiml);
  } catch (err: any) {
    console.error("WhatsApp webhook error:", err);
    res.status(500).send("<Response><Message>An error occurred. Please try again.</Message></Response>");
  }
});

// GET /api/whatsapp/status – health check
router.get("/status", (_req, res) => {
  res.json({ status: "WhatsApp webhook active", timestamp: new Date().toISOString() });
});

export default router;
