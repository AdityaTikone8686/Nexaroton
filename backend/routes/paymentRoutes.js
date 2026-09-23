import express from "express";
import crypto from "crypto";

import razorpay from "../services/razorpayService.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getPlan } from "../config/plans.js";

const router = express.Router();

/*
  Create Razorpay Order
  POST /api/payment/create-order
*/
router.post("/create-order", requireAuth, async (req, res) => {
  try {
    const { planId } = req.body;

    // Validate plan
    const plan = getPlan(planId);

    if (!plan) {
      return res.status(400).json({
        error: "Invalid plan selected."
      });
    }

    // Convert INR to paise
    const amount = Math.round(plan.price * 100);

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `orebound_${req.user.userId}_${Date.now()}`,
      notes: {
        userId: req.user.userId,
        planId: plan.id
      }
    });

    return res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price
      }
    });

  } catch (error) {
    console.error("Create Razorpay order error:", error);

    return res.status(500).json({
      error: "Unable to create payment order."
    });
  }
});


/*
  Verify Razorpay Payment
  POST /api/payment/verify
*/
router.post("/verify", requireAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: "Payment verification data is incomplete."
      });
    }

    const body =
      `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    const isValid =
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!isValid) {
      return res.status(400).json({
        error: "Invalid payment signature."
      });
    }

    return res.json({
      success: true,
      message: "Payment verified successfully."
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      error: "Unable to verify payment."
    });
  }
});

export default router;