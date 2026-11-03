import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import responses from "./data/responses.json";

const PRODUCTS = {
  jeans: { prompt: responses.jeans.prompt, rec: responses.jeans.response },
  smartphone: { prompt: responses.smartphone.prompt, rec: responses.smartphone.response },
  laptop: { prompt: responses.laptop.prompt, rec: responses.laptop.response },
  "t-shirt": { prompt: responses["t-shirt"].prompt, rec: responses["t-shirt"].response },
  tshirt: { prompt: responses["t-shirt"].prompt, rec: responses["t-shirt"].response }
};

function ChatPage() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("product");
  const [prod, setProd] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const it = setInterval(() => { const f = document.getElementById("nl-badge-frame"); if (f) f.remove(); }, 400);
    return () => clearInterval(it);
  }, [theme]);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const lower = input.toLowerCase();
    let reply = responses.fallback;
    if (stage === "product") {
      const found = Object.keys(PRODUCTS).find(k => lower.includes(k));
      if (found) { setProd(found); reply = PRODUCTS[found].prompt; setStage("budget"); }
    } else {
      if (prod) { reply = PRODUCTS[prod].rec; setStage("completed"); }
      else { const f = Object.keys(PRODUCTS).find(k => lower.includes(k)); if (f) { setProd(f); reply = PRODUCTS[f].prompt; setStage("budget"); } }
    }
    const nm = [...msgs, { from: "user", text: input, time: new Date().toLocaleTimeString() }, { from: "ai", text: reply, time: new Date().toLocaleTimeString() }];
    setMsgs(nm); setInput("");
  };

  const saveConv = (ms) => {
    const all = JSON.parse(localStorage.getItem("conversations") || "[]");
    all.push({ id: Date.now(), messages: ms.map(m => ({ from: m.from, text: m.text, name: m.from === "user" ? "You" : "Product Recommendation AI", time: m.time })), rating: rating || 4, feedback, date: new Date().toISOString() });
    localStorage.setItem("conversations", JSON.stringify(all));
  };

  const newSuggestion = () => {
    if (msgs.length > 0) saveConv(msgs);
    setMsgs([]); setStage("product"); setProd(null); setRating(0); setFeedback("");
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="new-suggestion" onClick={newSuggestion}>💬 Want new suggestion? ↗️</div>
        <Link to="/history" href="/history"><button type="button" className="btn-history">Previous Suggestions</button></Link>
      </div>
      <div className="chat-area" style={{ background: theme === "dark" ? "#121212" : "#fff" }}>
        <div className="header"><h1>Product Recommendation AI</h1><button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"} ⚙️</button></div>
        <div className="msg-list">
          {msgs.map((m, i) => (
            <div key={i} className={m.from === "ai" ? "msg msg-ai" : "msg msg-user"} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <img className="avatar" src={m.from === "user" ? "https://i.pravatar.cc/40?img=12" : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"} alt="av" />
              <div><b>{m.from === "user" ? "You" : "Product Recommendation AI"}</b><div>{m.text}</div><small>{m.time}</small>{m.from === "ai" && hover === i && <div className="hover-actions"><button type="button" onClick={() => setRating(5)}>👍</button><button type="button" onClick={() => setShowModal(true)}>👎</button></div>}</div>
            </div>
          ))}
          {msgs.length === 0 && <div style={{ textAlign: "center", marginTop: 40 }}><h2>Hi, Please tell me what you want?</h2><div style={{ fontSize: 40 }}>🤖</div><div className="cards">{["Jeans", "Smartphone", "Laptop", "T-Shirt"].map(c => <div key={c} className="card" onClick={() => setInput(c)}><b>{c}</b><br /><small>Get immediate AI generated response</small></div>)}</div></div>}
          {stage === "completed" && <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}><b>Rate this conversation</b><div>{[1, 2, 3, 4, 5].map(n => <span key={n} onClick={() => setRating(n)} style={{ fontSize: 22, cursor: "pointer" }}>{n <= rating ? "★" : "☆"}</span>)}</div><textarea placeholder="Provide Additional Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width: "100%", marginTop: 8, padding: 8 }} /></div>}
        </div>
        <form onSubmit={handleAsk} className="input-bar">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Please tell me about your query!" />
          <button type="submit">Ask</button>
          <button type="submit" onClick={(e) => { e.preventDefault(); if (msgs.length > 0) { saveConv(msgs); alert("Saved!"); } }}>Save</button>
        </form>
      </div>
      {showModal && <div className="modal-overlay"><div className="modal"><h3>Provide Additional Feedback</h3><textarea value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width: "100%", height: 100 }} /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}><button type="button" onClick={() => setShowModal(false)}>Cancel</button><button type="button" onClick={() => setShowModal(false)}>Submit</button></div></div></div>}
    </div>
  );
}

function HistoryPage() {
  const [convs, setConvs] = useState([]); const [filter, setFilter] = useState("All Ratings");
  useEffect(() => setConvs(JSON.parse(localStorage.getItem("conversations") || "[]")), []);
  const filtered = filter === "All Ratings" ? convs : convs.filter(c => String(c.rating || 4) === filter);
  return (
    <div className="app">
      <div className="sidebar"><Link to="/" href="/"><div className="new-suggestion">💬 Want new suggestion? ↗️</div></Link><Link to="/history" href="/history"><button type="button" className="btn-history">Previous Suggestions</button></Link></div>
      <div style={{ flex: 1, padding: 20, overflow: "auto" }}><h1>Product Recommendation AI</h1><h2 style={{ textAlign: "center" }}>Previous Suggestions</h2><label>Filter by rating</label><br /><select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 6, marginTop: 6 }}><option>All Ratings</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select><h4 style={{ marginTop: 20 }}>Today's chats</h4>{filtered.map((c, i) => <div key={i} style={{ marginBottom: 12 }}>{c.messages?.map((m, j) => <div key={j} style={{ background: "#e9d5ff", padding: 8, marginBottom: 6, borderRadius: 6 }}><b>{m.name}</b> {m.text} <small>Rating:{c.rating}</small>{c.feedback && <div>Feedback:{c.feedback}</div>}</div>)}</div>)}</div>
    </div>
  );
}

export default function App() { return (<BrowserRouter><Routes><Route path="/" element={<ChatPage />} /><Route path="/history" element={<HistoryPage />} /></Routes></BrowserRouter>); }