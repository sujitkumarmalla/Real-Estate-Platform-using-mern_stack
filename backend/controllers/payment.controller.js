import Stripe from "stripe";
import User from "../models/user_model.js";

const getStripeInstance = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    return new Stripe(key);
};

export const createCheckoutSession = async (req, res) => {
    try {
        const { planId } = req.body;
        const stripe = getStripeInstance();

        let amount, credits, planName;
        if (planId === "bronze") {
            amount = 29900; // ₹299
            credits = 50;
            planName = "Bronze Plan (50 Credits)";
        } else if (planId === "silver") {
            amount = 99900; // ₹999
            credits = 200;
            planName = "Silver Plan (200 Credits)";
        } else if (planId === "gold") {
            amount = 199900; // ₹1999
            credits = 1000;
            planName = "Gold Plan (1000 Credits)";
        } else {
            return res.status(400).json({ message: "Invalid Plan ID" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: planName,
                            description: `Purchase ${credits} credits for real-time messaging on RealEstate Platform`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/chat?success=true`,
            cancel_url: `http://localhost:5173/chat?canceled=true`,
            metadata: {
                userId: req.user._id.toString(),
                credits: credits.toString(),
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe session creation error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {
    const stripe = getStripeInstance();
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (sig && endpointSecret) {
            // Verify event using raw body
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            // Fallback for parsing direct requests in testing
            const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : req.body;
            event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
        }
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const creditsToAdd = parseInt(session.metadata?.credits || "0", 10);

        if (userId && creditsToAdd > 0) {
            try {
                const user = await User.findById(userId);
                if (user) {
                    user.credits = (user.credits || 0) + creditsToAdd;
                    await user.save();
                    console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);

                    // Emit real-time creditUpdate event via Socket
                    const io = req.app.get("socketio");
                    const onlineUsers = req.app.get("onlineUsers") || new Map();
                    const socketId = onlineUsers.get(userId);
                    if (io && socketId) {
                        io.to(socketId).emit("creditUpdate", { credits: user.credits });
                    }
                }
            } catch (dbErr) {
                console.error("Webhook DB update failed:", dbErr);
                return res.status(500).send("Database update failed");
            }
        }
    }

    res.json({ received: true });
};
