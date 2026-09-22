import React from "react";
import PlanGrid from "../components/PlanGrid.jsx";

export default function Plans() {
  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">PLANS</span>
          <h2>Choose your gear tier</h2>
          <p>Every tier includes 24/7 uptime, automated backups, and DDoS protection. Switch plans anytime from your dashboard.</p>
        </div>
        <PlanGrid />
        <p style={{ marginTop: 24, fontSize: ".82rem" }}>*Netherite's player cap is limited only by your server's RAM allocation.</p>
      </div>
    </section>
  );
}
