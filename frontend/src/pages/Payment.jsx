import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paymentApi } from "/lib/api.js";

export default function Payment() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // ---------------------------------------
  // Load Razorpay Checkout
  // ---------------------------------------
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      console.log("Razorpay Checkout loaded");
      setRazorpayLoaded(true);
    };

    script.onerror = () => {
      console.error(
        "Failed to load Razorpay Checkout"
      );

      setError(
        "Unable to load Razorpay Checkout. Please check your internet connection and try again."
      );

      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove the script here.
      // It can be reused if the component mounts again.
    };
  }, []);

  // ---------------------------------------
  // Load selected plan
  // ---------------------------------------
  useEffect(() => {
    const savedPlan = sessionStorage.getItem(
      "oreboundSelectedPlan"
    );

    if (!savedPlan) {
      navigate("/plans");
      return;
    }

    try {
      const parsedPlan = JSON.parse(savedPlan);

      if (!parsedPlan?.id) {
        throw new Error("Invalid plan");
      }

      setPlan(parsedPlan);

    } catch {
      sessionStorage.removeItem(
        "oreboundSelectedPlan"
      );

      navigate("/plans");
    }
  }, [navigate]);

  // ---------------------------------------
  // Handle payment
  // ---------------------------------------
  async function handlePayment() {
    if (!plan) {
      return;
    }

    setError("");
    setSuccess("");

    // Check Razorpay
    if (!razorpayLoaded || !window.Razorpay) {
      setError(
        "Razorpay Checkout is not loaded yet. Please wait a moment and try again."
      );

      return;
    }

    // Check Razorpay Key
    const razorpayKey =
      import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      setError(
        "Razorpay Key ID is missing. Please check your frontend .env file."
      );

      return;
    }

    try {
      setLoading(true);

      // ---------------------------------------
      // Create order on backend
      // ---------------------------------------
      console.log(
        "Creating Razorpay order..."
      );

      const result =
        await paymentApi.createOrder(plan.id);

      console.log(
        "Razorpay order created:",
        result
      );

      const order = result?.order;

      if (!order?.id) {
        throw new Error(
          "Invalid Razorpay order received from server."
        );
      }

      // ---------------------------------------
      // Get logged-in user
      // ---------------------------------------
      let user = {};

      try {
        user = JSON.parse(
          localStorage.getItem(
            "oreboundUser"
          ) || "{}"
        );
      } catch {
        user = {};
      }

      // ---------------------------------------
      // Razorpay Checkout
      // ---------------------------------------
      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Nexaroton",

        description:
          `${plan.name} Plan`,

        order_id: order.id,

        // ---------------------------------------
        // Successful payment
        // ---------------------------------------
        handler: async function (response) {
          console.log(
            "Razorpay payment response:",
            response
          );

          try {
            setError("");
            setSuccess("");
            setLoading(true);

            // Verify payment on backend
            const verification =
              await paymentApi.verifyPayment({
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature
              });

            console.log(
              "Payment verification response:",
              verification
            );

            if (verification?.success) {
              setSuccess(
                "Payment verified successfully!"
              );

              /*
                IMPORTANT:

                We are NOT navigating to the dashboard yet.

                The backend still needs to activate
                the user's subscription.
              */

              console.log(
                "Payment verified successfully."
              );
            } else {
              setError(
                "Payment verification was not successful."
              );
            }

          } catch (err) {
            console.error(
              "Payment verification error:",
              err
            );

            setError(
              err.message ||
              "Payment verification failed. Please contact support if money was deducted."
            );

          } finally {
            setLoading(false);
          }
        },

        // ---------------------------------------
        // User information
        // ---------------------------------------
        prefill: {
          name: user.username || "",
          email: user.email || ""
        },

        // ---------------------------------------
        // Razorpay appearance
        // ---------------------------------------
        theme: {
          color: "#4fd8e0"
        },

        // ---------------------------------------
        // Payment modal closed
        // ---------------------------------------
        modal: {
          ondismiss: function () {
            setLoading(false);

            setError(
              "Payment was cancelled or the payment window was closed."
            );
          }
        }
      };

      // ---------------------------------------
      // Create Razorpay instance
      // ---------------------------------------
      const razorpay =
        new window.Razorpay(options);

      // ---------------------------------------
      // Payment failed
      // ---------------------------------------
      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          const razorpayError =
            response?.error;

          const description =
            razorpayError?.description;

          const reason =
            razorpayError?.reason;

          const code =
            razorpayError?.code;

          let message =
            "Payment failed. Please try again.";

          if (description) {
            message =
              `Payment failed: ${description}`;
          } else if (reason) {
            message =
              `Payment failed: ${reason}`;
          }

          if (code) {
            message += ` (${code})`;
          }

          setError(message);
          setSuccess("");
          setLoading(false);
        }
      );

      // ---------------------------------------
      // Open Razorpay Checkout
      // ---------------------------------------
      razorpay.open();

    } catch (err) {
      console.error(
        "Payment error:",
        err
      );

      setError(
        err.message ||
        "Unable to create payment order."
      );

      setLoading(false);
    }
  }

  // ---------------------------------------
  // Loading screen
  // ---------------------------------------
  if (!plan) {
    return (
      <main className="page">
        <div className="container">
          <p>Loading payment...</p>
        </div>
      </main>
    );
  }

  // ---------------------------------------
  // Payment page
  // ---------------------------------------
  return (
    <main className="page">
      <div className="container">

        <div className="slot">

          <h1>
            Complete Your Payment
          </h1>

          <p>
            You selected the{" "}
            <strong>
              {plan.name}
            </strong>{" "}
            plan.
          </p>

          <div className="price">
            ₹{Number(plan.price).toFixed(2)}
            <span>/month</span>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="error"
              style={{
                marginTop: "16px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ff6b6b",
                background: "rgba(255, 107, 107, 0.1)",
                lineHeight: "1.5"
              }}
            >
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #4fd8a8",
                background: "rgba(79, 216, 168, 0.1)",
                lineHeight: "1.5"
              }}
            >
              {success}
            </div>
          )}

          {/* Pay button */}
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={
              loading ||
              !razorpayLoaded
            }
            style={{
              marginTop: "20px"
            }}
          >
            {loading
              ? "Processing..."
              : !razorpayLoaded
              ? "Loading Payment..."
              : `Pay ₹${Number(
                  plan.price
                ).toFixed(2)}`}
          </button>

          {/* Change plan */}
          <button
            className="btn btn-ghost"
            onClick={() =>
              navigate("/plans")
            }
            disabled={loading}
            style={{
              marginTop: "10px"
            }}
          >
            Change Plan
          </button>

        </div>

      </div>
    </main>
  );
}

