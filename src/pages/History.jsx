import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function HistoryPage({ theme, setTheme }) {
  const [convs, setConvs] = useState([]);
  const [filter, setFilter] = useState("All Ratings");
  useEffect(() => setConvs(JSON.parse(localStorage.getItem("conversations") || "[]")), []);
  const filtered = convs.filter(c => filter === "All Ratings" ? true : c.rating == parseInt(filter));
  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/" style={{ textDecoration: "none" }}><div className="new-btn">💬 Want new suggestion? <span>↗️</span></div></Link>
        <button className="prev-btn active">Previous Suggestions</button>
      </div>
      <div className="main">
        <Header theme={theme} setTheme={setTheme} />
        <div style={{ padding: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Previous Suggestions</h2>
          <label>Filter by rating</label><br />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "6px", marginTop: "6px" }}>
            <option>All Ratings</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
          </select>
          <h4 style={{ marginTop: "20px" }}>Today's chats</h4>
          {filtered.map((conv, idx) => (<div key={idx}>{conv.messages?.map((m, i) => (<div key={i} className="msg" style={{ background: "#e9d5ff", marginBottom: "8px" }}><img src={m.from === "user" ? "https://i.pravatar.cc/40?img=12" : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"} className="av" /><div><b>{m.name}</b><div>{m.text}</div><small>{m.time}</small></div></div>))}</div>))}
        </div>
      </div>
    </div>
  );
}