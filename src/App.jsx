import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import data from "./data/responses.json";

function Chat() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("product");
  const [prod, setProd] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const id = setInterval(() => { const f = document.getElementById("nl-badge-frame"); if (f) f.remove(); }, 500);
    return () => clearInterval(id);
  }, [theme]);

  const saveCurrent = () => {
    if (msgs.length === 0) return;
    const all = JSON.parse(localStorage.getItem("conversations") || "[]");
    all.push({
      id: Date.now(),
      messages: msgs.map(m => ({ from: m.from, text: m.text, name: m.from === "user" ? "You" : "Product Recommendation AI", time: m.time })),
      rating: rating || 4,
      feedback,
      date: new Date().toISOString()
    });
    localStorage.setItem("conversations", JSON.stringify(all));
  };

  const handleAsk = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const lower = input.toLowerCase();
    let reply = "Sorry, I did not understand your query!";
    
    if (stage === "product") {
      const found = Object.keys(data).find(k => lower.includes(k));
      if (found) { setProd(found); reply = data[found].prompt; setStage("budget"); }
    } else {
      if (prod) { reply = data[prod].answer; setStage("completed"); }
      else {
        const found = Object.keys(data).find(k => lower.includes(k));
        if (found) { setProd(found); reply = data[found].prompt; setStage("budget"); }
      }
    }
    setMsgs([...msgs, { from: "user", text: input, time: new Date().toLocaleTimeString() }, { from: "ai", text: reply, time: new Date().toLocaleTimeString() }]);
    setInput("");
  };

  const newSuggestion = () => {
    if (msgs.length > 0) saveCurrent();
    setMsgs([]); setStage("product"); setProd(null); setRating(0); setFeedback("");
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="new-box" onClick={newSuggestion}>💬 Want new suggestion? ↗️</div>
        <Link to="/history" href="/history"><button type="button" className="btn-prev">Previous Suggestions</button></Link>
      </div>
      <div className="chat" style={{ background: theme === "dark" ? "#121212" : "#fff" }}>
        <div className="header"><h1>Product Recommendation AI</h1><button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"} Mode</button></div>
        <div className="msg-list">
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.from === "user" ? "user" : "ai"}`}>
              <img className="avatar" src={m.from === "user" ? "https://i.pravatar.cc/40?img=5" : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"} alt="av" />
              <div><b>{m.from === "user" ? "You" : "Product Recommendation AI"}</b><div>{m.text}</div><small>{m.time}</small></div>
              {m.from === "ai" && <div className="hover-box"><button type="button" onClick={() => { setModalType("star"); setShowModal(true); }}>👍</button><button type="button" onClick={() => { setModalType("feedback"); setShowModal(true); }}>👎</button></div>}
            </div>
          ))}
          {msgs.length === 0 && <div style={{ textAlign: "center", marginTop: 30 }}><h2>Hi, Please tell me what you want?</h2><div style={{ fontSize: 48 }}>🤖</div><div className="cards">{["Jeans", "Smartphone", "Laptop", "T-Shirt"].map(c => <div key={c} className="card" onClick={() => setInput(c)}><b>{c}</b><br /><small>Get immediate AI generated response</small></div>)}</div></div>}
          {stage === "completed" && <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10, background: "#fff", color: "#000" }}><b>Rate this conversation</b><div>{[1, 2, 3, 4, 5].map(n => <span key={n} className="stars" onClick={() => setRating(n)}>{n <= rating ? "★" : "☆"}</span>)}</div><textarea placeholder="Provide Additional Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 6 }} /></div>}
        </div>
        <form onSubmit={handleAsk} className="input-bar">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Please tell me about your query!" />
          <button type="submit">Ask</button>
          <button type="submit" onClick={(e) => { e.preventDefault(); saveCurrent(); alert("Saved!"); }}>Save</button>
        </form>
      </div>
      {showModal && <div className="modal-bg"><div className="modal">{modalType === "star" ? <><h3>Rate this response</h3><div>{[1, 2, 3, 4, 5].map(n => <span key={n} className="stars" onClick={() => { setRating(n); setShowModal(false); }}>{n <= rating ? "★" : "☆"}</span>)}</div><button type="button" onClick={() => setShowModal(false)} style={{ marginTop: 10 }}>Close</button></> : <><h3>Provide Additional Feedback</h3><textarea value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width: "100%", height: 100 }} placeholder="Write feedback..." /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}><button type="button" onClick={() => setShowModal(false)}>Cancel</button><button type="button" onClick={() => { localStorage.setItem("feedback_" + Date.now(), feedback); setShowModal(false); }}>Submit</button></div></>}</div></div>}
    </div>
  );
}

function History() {
  const [convs, setConvs] = useState([]);
  const [filter, setFilter] = useState("All Ratings");
  useEffect(() => setConvs(JSON.parse(localStorage.getItem("conversations") || "[]")), []);
  const filtered = filter === "All Ratings" ? convs : convs.filter(c => String(c.rating) === filter);
  return (
    <div className="app">
      <div className="sidebar"><Link to="/" href="/"><div className="new-box">💬 Want new suggestion? ↗️</div></Link><Link to="/history" href="/history"><button type="button" className="btn-prev">Previous Suggestions</button></Link></div>
      <div style={{ flex: 1, padding: 20, overflow: "auto" }}><h1>Product Recommendation AI</h1><h2 style={{ textAlign: "center", margin: "10px 0" }}>Previous Suggestions</h2><label>Filter by rating</label><br /><select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 6, marginTop: 6 }}><option>All Ratings</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select><h4 style={{ marginTop: 20 }}>Today's chats</h4>{filtered.length === 0 && <p>No conversations saved</p>}{filtered.map((c, i) => <div key={i} style={{ marginBottom: 14 }}>{c.messages?.map((m, j) => <div key={j} style={{ background: "#e9d5ff", padding: 10, borderRadius: 8, marginBottom: 6, color: "#000" }}><b>{m.name}</b> {m.text} <small>({c.rating}★)</small>{c.feedback && <div><i>Feedback: {c.feedback}</i></div>}</div>)}</div>)}</div>
    </div>
  );
}

export default function App() { return <BrowserRouter><Routes><Route path="/" element={<Chat />} /><Route path="/history" element={<History />} /></Routes></BrowserRouter>; }