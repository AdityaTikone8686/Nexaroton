import React from "react";
import { useNavigate } from "react-router-dom";
import { PLANS } from "../lib/data.js";

export default function PlanGrid() {
  const navigate = useNavigate();

  function getAuthenticatedUser() {
    const token = localStorage.getItem("oreboundToken");
    const savedUser = localStorage.getItem("oreboundUser");

    if (!token || !savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("oreboundUser");
      return null;
    }
  }

  function handleChoose(plan) {
    // Save the selected plan temporarily
    sessionStorage.setItem(
      "oreboundSelectedPlan",
      JSON.stringify({
        id: plan.id,
        name: plan.name,
        price: plan.price
      })
    );

    const user = getAuthenticatedUser();

    // Not logged in
    if (!user) {
      navigate("/signup");
      return;
    }

    // Logged in → payment
    navigate("/payment");
  }

  return (
    <div className="plan-grid">
      {PLANS.map((p) => (
        <div
          key={p.id}
          className={
            "slot plan" +
            (p.featured ? " featured" : "")
          }
        >
          {p.featured && (
            <span className="badge">
              MOST CHOSEN
            </span>
          )}

          <span
            className="swatch"
            style={{
              background: p.color
            }}
          ></span>

          <h3>{p.name}</h3>

          <div className="price">
            ₹{p.price.toFixed(2)}
            <span>/month</span>
          </div>

          <ul>
            <li>{p.ram} RAM</li>
            <li>{p.slots}</li>
            <li>Backups: {p.backups}</li>
            <li>Support: {p.support}</li>
          </ul>

          <button
            className="btn btn-primary btn-block"
            onClick={() => handleChoose(p)}
          >
            Choose {p.name}
          </button>
        </div>
      ))}
    </div>
  );
}