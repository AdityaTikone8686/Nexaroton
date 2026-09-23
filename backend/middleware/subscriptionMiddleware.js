import User from "../models/User.js";

export const requireSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    // No active subscription
    if (user.subscription.status !== "active") {
      return res.status(403).json({
        error: "Active subscription required.",
        subscriptionRequired: true
      });
    }

    // Check subscription expiry
    if (
      user.subscription.expiresAt &&
      user.subscription.expiresAt <= new Date()
    ) {
      user.subscription.status = "expired";
      await user.save();

      return res.status(403).json({
        error: "Your subscription has expired.",
        subscriptionRequired: true
      });
    }

    next();

  } catch (error) {
    console.error("Subscription middleware error:", error);

    return res.status(500).json({
      error: "Failed to verify subscription."
    });
  }
};

