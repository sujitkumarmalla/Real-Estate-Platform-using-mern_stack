import express from "express";
import { protect } from "../middlewares/auth.middlewares.js";
import { createCheckoutSession, stripeWebhook } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

// Session route
paymentRouter.post("/create-checkout-session", protect, createCheckoutSession);

// Webhook route - Stripe requires raw body, which will be handled in server.js middleware
paymentRouter.post("/webhook", stripeWebhook);

export default paymentRouter;
