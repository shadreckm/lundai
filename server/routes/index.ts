import { Router } from "express";
import listingRoutes from "./listings.js";
import searchRoutes from "./search.js";
import whatsappRoutes from "./whatsapp.js";
import paymentRoutes from "./payments.js";
import authRoutes from "./auth.js";

const router = Router();

router.use("/listings", listingRoutes);
router.use("/search", searchRoutes);
router.use("/whatsapp", whatsappRoutes);
router.use("/payments", paymentRoutes);
router.use("/auth", authRoutes);

// Catch-all for unknown API routes
router.use("*", (req, res) => {
  res.status(404).json({ error: "API route not found", path: req.originalUrl });
});

export default router;
