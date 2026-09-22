import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES } from "../lib/data.js";
import { useApp } from "../lib/store.jsx";
import ThreadList from "../components/ThreadList.jsx";
import NewThreadForm from "../components/NewThreadForm.jsx";

export default function ForumCategory() {
  const { catId } = useParams();
  const { threads } = useApp();
  const navigate = useNavigate();
  const cat = CATEGORIES.find((c) => c.id === catId);
  const catThreads = threads.filter((t) => t.cat === catId).sort((a, b) => b.created - a.created);

  return (
    <section>
      <div className="wrap">
        <div className="crumbs">
          <button onClick={() => navigate("/forum")}>Forum</button>
        </div>
        <div className="section-head">
          <h2>{cat ? cat.name : catId}</h2>
          <p>{cat ? cat.desc : ""}</p>
        </div>
        <ThreadList threads={catThreads} />
        <NewThreadForm defaultCat={catId} />
      </div>
    </section>
  );
}
