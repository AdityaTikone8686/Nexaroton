import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PlanGrid from "../components/PlanGrid.jsx";
import ThreadList from "../components/ThreadList.jsx";
import { useApp } from "../lib/store.jsx";

function copyIP(toast) {
  const text = "enthusiasm-salvation.tun.ply.gg";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast("Server IP copied: " + text))
      .catch(() => toast(text));
  } else {
    toast(text);
  }
}

export default function Home() {
  const { threads, toast } = useApp();
  const navigate = useNavigate();
  const [players, setPlayers] = useState("—");
  const [tps, setTps] = useState("—");

  useEffect(() => {
    function tick() {
      setPlayers(8 + Math.floor(Math.random() * 9));
      setTps((19.6 + Math.random() * 0.4).toFixed(1));
    }
    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, []);

  const recent = [...threads].sort((a, b) => b.created - a.created).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="tag">
              <span className="pulse"></span> Live &amp; online right now
            </span>
            <h1 style={{ marginTop: ".5em" }}>
              Your world.
              <br />
              <span>Always loaded.</span>
            </h1>
            <p>
              Nexaroton keeps a Minecraft world running around the clock — no idling, no "server's asleep," no
              losing your redstone build to a shutdown at 2am.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate("/plans")}>
                View plans
              </button>
              <button className="btn btn-ghost" onClick={() => navigate("/forum")}>
                Visit the forum
              </button>
            </div>
            <div className="ip-row">
              <span className="ip-chip">
                SEE PLANS TO UNLOCK{" "}
                <button className="btn btn-sm" onClick={() => copyIP(toast)}>
                  Copy
                </button>
              </span>
            </div>
            <div className="stat-row">
              <div>
                <b>{players}</b>
                <span>players online</span>
              </div>
              <div>
                <b>99.97%</b>
                <span>uptime, 30 days</span>
              </div>
              <div>
                <b>{tps}</b>
                <span>server TPS</span>
              </div>
            </div>
          </div>

          <div className="slot console-mock" aria-hidden="true">
            <div className="ln">
              [server] <b>Starting Nexaroton v4.2 (1.21)</b>
            </div>
            <div className="ln">[server] Preparing spawn area: 100%</div>
            <div className="ln">
              [server] <b>Done!</b> World loaded in 4.2s
            </div>
            <div className="ln">[chat] CobbleQueen joined the game</div>
            <div className="ln">[chat] Deepslate_Dan joined the game</div>
            <div className="ln">[chat] &lt;CobbleQueen&gt; anyone up for the ancient city run?</div>
            <div className="ln">[chat] &lt;WardenBait&gt; give me 5, gearing up</div>
            <div className="ln">[server] Autosave complete</div>
            <div className="ln">[chat] &lt;Deepslate_Dan&gt; bringing the boat</div>
          </div>
        </div>
        <div className="terrain wrap" style={{ maxWidth: 1120, margin: "40px auto 0" }}></div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">WHY NEXAROTON</span>
            <h2>Built for worlds people actually live in</h2>
            <p>Every plan runs on dedicated hardware with the same protections — the tiers below just scale the room you get.</p>
          </div>
          <div className="feat-grid">
            <div className="slot feat">
              <span className="ic">⛏️</span>
              <h4>24/7 uptime</h4>
              <p>Your world stays running whether one player is on or forty — no sleep timers.</p>
            </div>
            <div className="slot feat">
              <span className="ic">🛡️</span>
              <h4>DDoS shielded</h4>
              <p>Traffic is filtered before it reaches your server, so a bad actor can't take your world offline.</p>
            </div>
            <div className="slot feat">
              <span className="ic">📦</span>
              <h4>One-click modpacks</h4>
              <p>Install Forge, Fabric, or a Modrinth pack from the dashboard — no file transfers needed.</p>
            </div>
            <div className="slot feat">
              <span className="ic">⏱️</span>
              <h4>Instant restarts</h4>
              <p>Push a config change or update a plugin and be back online in under 15 seconds.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--bg-2)", borderTop: "4px solid var(--border)", borderBottom: "4px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">PLANS</span>
            <h2>Pick your gear tier</h2>
            <p>Upgrade or downgrade anytime — your world and builds carry over automatically.</p>
          </div>
          <PlanGrid />
        </div>
      </section>

      <section>
        <div className="wrap two-col" style={{ alignItems: "center" }}>
          <div>
            <span className="kicker">COMMUNITY</span>
            <h2>A forum for the people actually playing</h2>
            <p>Coordinate builds, report bugs, or just brag about the ancient city you found. Every account gets a forum profile automatically.</p>
            <Link className="btn btn-primary" to="/forum">
              Browse the forum
            </Link>
          </div>
          <ThreadList threads={recent} />
        </div>
      </section>
    </>
  );
}
