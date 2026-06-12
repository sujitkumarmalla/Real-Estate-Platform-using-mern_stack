import express from "express";
import Newsletter from "../models/newsletter.model.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "Email is already subscribed!" });
        }

        const subscription = new Newsletter({ email });
        await subscription.save();

        res.status(201).json({ success: true, message: "Subscribed successfully! Thank you." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default newsletterRouter;
