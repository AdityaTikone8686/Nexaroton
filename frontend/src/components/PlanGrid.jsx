import React from "react";
import { useNavigate } from "react-router-dom";
import { PLANS } from "../lib/data.js";
import { useApp } from "../lib/store.jsx";

export default function PlanGrid() {
  const { currentUser, choosePlan } = useApp();
  const navigate = useNavigate();

  function handleChoose(plan) {
    if (!currentUser) {
      navigate("/signup");
      return;
    }
    choosePlan(plan.id, plan.name);
    navigate("/dashboard");
  }

  return (
    <div className="plan-grid">
      {PLANS.map((p) => (
        <div key={p.id} className={"slot plan" + (p.featured ? " featured" : "")}>
          {p.featured && <span className="badge">MOST CHOSEN</span>}
          <span className="swatch" style={{ background: p.color }}></span>
          <h3>{p.name}</h3>
          <div className="price">
            ${p.price.toFixed(2)}
            <span>/month</span>
          </div>
          <ul>
            <li>{p.ram} RAM</li>
            <li>{p.slots}</li>
            <li>Backups: {p.backups}</li>
            <li>Support: {p.support}</li>
          </ul>
          <button className="btn btn-primary btn-block" onClick={() => handleChoose(p)}>
            Choose {p.name}
          </button>
        </div>
      ))}
    </div>
  );
}
