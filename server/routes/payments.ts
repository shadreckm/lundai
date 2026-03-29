import { Router, type Request, type Response } from "express";
import { PaymentService } from "../services/paymentService.js";

const router = Router();

// POST /api/payments/checkout
router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { propertyId, propertyTitle, amount, currency, customerEmail, customerName, customerPhone } = req.body;

    if (!propertyId || !amount || !customerEmail || !customerName) {
      return res.status(400).json({
        error: "Missing required fields: propertyId, amount, customerEmail, customerName",
      });
    }

    const result = await PaymentService.createCheckoutSession({
      userId: (req as any).user?.id,
      propertyId,
      propertyTitle: propertyTitle || "Student Housing",
      amount: parseFloat(amount),
      currency: currency || "MWK",
      customerEmail,
      customerName,
      customerPhone,
    });

    if (result.status === "error") {
      return res.status(502).json({ error: "Payment gateway error", message: result.message });
    }

    res.json(result);
  } catch (err: any) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed", message: err.message });
  }
});

// POST /api/payments/callback – PayChangu webhook
router.post("/callback", async (req: Request, res: Response) => {
  try {
    const { tx_ref, status } = req.body;
    console.log(`Payment callback: txRef=${tx_ref}, status=${status}`);
    // TODO: update transaction record in DB
    res.json({ received: true });
  } catch (err: any) {
    res.status(500).json({ error: "Callback processing failed" });
  }
});

// GET /api/payments/verify/:txRef
router.get("/verify/:txRef", async (req: Request, res: Response) => {
  try {
    const result = await PaymentService.verifyPayment(req.params.txRef);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "Verification failed", message: err.message });
  }
});

export default router;
