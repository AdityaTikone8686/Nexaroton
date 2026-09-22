import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-main">
        <div className="footer-brand">
          <img
            src="/logo.png"
            alt="Orebound"
            className="footer-logo"
          />

          <div>
            <div className="footer-name">Nexaroton</div>
            <p>24/7 Minecraft Server Hosting</p>
          </div>
        </div>

        <div className="footer-info">
          <p>
            © 2026 Nexaroton. A fan-run Minecraft community project.
          </p>
          <p>
            Not affiliated with Mojang or Microsoft.
          </p>
        </div>

        <div className="footer-status">
          <span className="status-dot"></span>
          <span>Uptime Status :</span>
          <span className="footer-uptime">99.97% uptime</span>
        </div>
      </div>
    </footer>
  );
}


