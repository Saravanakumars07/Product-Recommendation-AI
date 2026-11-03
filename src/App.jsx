import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const DATA = {
  jeans: { q: "Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)", r: "Wrogn - Rs 800" },
  smartphone: { q: "Please select your budget (10000 - 20000, 20000 - 30000)", r: "Redmi Note 12 - Rs 18000" },
  laptop: { q: "Please select your budget (30000 - 60000, 60000 - 90000)", r: "Lenovo IdeaPad - Rs 45000" },
  "t-shirt": { q: "Please select your budget (200 - 500, 500 - 1000, 1000 - 1500)", r: "Cotton T-Shirt - Rs 400" },
  tshirt: { q: "Please select your budget (200 - 500, 500 - 1000)", r: "Cotton T-Shirt" }
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
    const it = setInterval(() => { const f = document.getElementById('nl-badge-frame'); if (f) f.remove(); }, 500);
    return () => clearInterval(it);
  }, [theme]);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const lower = input.toLowerCase();
    let reply = "Sorry, I did not understand your query!";
    if (stage === "product") {
      const found = Object.keys(DATA).find(k => lower.includes(k));
      if (found) { setProd(found); reply = DATA[found].q; setStage("budget"); }
    } else {
      if (prod) { reply = DATA[prod].r; setStage("completed"); }
      else {
        const found = Object.keys(DATA).find(k => lower.includes(k));
        if (found) { setProd(found); reply = DATA[found].q; setStage("budget"); }
      }
    }
    const nm = [...msgs, { from: "user", text: input, time: new Date().toLocaleTimeString() }, { from: "ai", text: reply, time: new Date().toLocaleTimeString() }];
    setMsgs(nm);
    const all = JSON.parse(localStorage.getItem("conversations") || "[]");
    all.push({ id: Date.now(), messages: nm.map(m => ({ from: m.from, text: m.text, name: m.from === "user" ? "You" : "Product Recommendation AI", time: m.time })), rating: rating || 4, feedback, date: new Date().toISOString() });
    localStorage.setItem("conversations", JSON.stringify(all.slice(-30)));
    setInput("");
  };

  const newSuggestion = () => {
    if (msgs.length > 0) {
      const all = JSON.parse(localStorage.getItem("conversations") || "[]");
      all.push({ id: Date.now(), messages: msgs.map(m => ({ from: m.from, text: m.text, name: m.from === "user" ? "You" : "Product Recommendation AI", time: m.time })), rating: rating || 4, feedback, date: new Date().toISOString() });
      localStorage.setItem("conversations", JSON.stringify(all));
    }
    setMsgs([]); setStage("product"); setProd(null); setRating(0); setFeedback("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "row" }} data-theme={theme}>
      <div style={{ width: "240px", padding: "12px", borderRight: "1px solid #ddd", background: theme === "dark" ? "#1e1e1e" : "#f9f9ff" }}>
        <div style={{ background: "#ddd6fe", padding: "12px", borderRadius: "10px", cursor: "pointer", marginBottom: "10px" }} onClick={newSuggestion}>💬 Want new suggestion? ↗️</div>
        <Link to="/history" href="/history" style={{ textDecoration: "none" }}><button type="button" style={{ width: "100%", padding: "10px", background: "#ddd6fe", border: "none", borderRadius: "8px", cursor: "pointer" }}>Previous Suggestions</button></Link>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: theme === "dark" ? "#121212" : "#fff", color: theme === "dark" ? "#fff" : "#000" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid #ddd" }}><h1>Product Recommendation AI</h1><button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"} ⚙️</button></div>
        <div style={{ flex: 1, overflow: "auto", padding: "10px" }}>
          {msgs.map((m, i) => <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ display: "flex", gap: "10px", padding: "12px", marginBottom: "8px", background: m.from === "ai" ? "#e9d5ff" : theme === "dark" ? "#2a2a2a" : "#fff", borderRadius: "8px", position: "relative", color: theme === "dark" && m.from !== "ai" ? "#fff" : "#000" }}><img src={m.from === "user" ? "https://i.pravatar.cc/40?img=12" : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"} style={{ width: "30px", height: "30px", borderRadius: "50%" }} alt="av" /><div><b>{m.from === "user" ? "You" : "Product Recommendation AI"}</b><div>{m.text}</div><small>{m.time}</small>{m.from === "ai" && hover === i && <div style={{ position: "absolute", right: "10px", top: "5px", background: "#fff", border: "1px solid #ddd", borderRadius: "20px", padding: "4px 8px", display: "flex", gap: "6px" }}><button type="button" onClick={() => setRating(5)}>👍</button><button type="button" onClick={() => setShowModal(true)}>👎</button></div>}</div></div>)}
          {msgs.length === 0 && <div style={{ textAlign: "center", marginTop: "40px" }}><h2>Hi, Please tell me what you want?</h2><div style={{ fontSize: "40px" }}>🤖</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>{["Jeans", "Smartphone", "Laptop", "T-Shirt"].map(c => <div key={c} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", cursor: "pointer" }} onClick={() => setInput(c)}><b>{c}</b><br /><small>Get immediate AI generated response</small></div>)}</div></div>}
          {stage === "completed" && <div style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "8px" }}><b>Rate this conversation</b><div>{[1, 2, 3, 4, 5].map(n => <span key={n} onClick={() => setRating(n)} style={{ fontSize: "22px", cursor: "pointer" }}>{n <= rating ? "★" : "☆"}</span>)}</div><textarea placeholder="Provide Additional Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width: "100%", marginTop: "8px", padding: "8px" }} /></div>}
        </div>
        <form onSubmit={handleAsk} style={{ display: "flex", gap: "8px", padding: "14px", borderTop: "1px solid #eee" }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Please tell me about your query!" style={{ flex: 1, padding: "10px" }} />
          <button type="submit" style={{ padding: "10px 20px" }}>Ask</button>
          <button type="submit" style={{ padding: "10px 20px" }} onClick={(e) => { e.preventDefault(); const all = JSON.parse(localStorage.getItem("conversations") || "[]"); all.push({ id: Date.now(), messages: msgs.map(m => ({ from: m.from, text: m.text, name: m.from === "user" ? "You" : "Product Recommendation AI" })), rating: rating || 4, feedback }); localStorage.setItem("conversations", JSON.stringify(all)); }}>Save</button>
        </form>
      </div>
      {showModal && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100000 }}><div style={{ background: "#fff", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "400px", color: "#000" }}><h3>Provide Additional Feedback</h3><textarea value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width: "100%", height: "100px" }} /><div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}><button type="button" onClick={() => setShowModal(false)}>Cancel</button><button type="button" onClick={() => setShowModal(false)}>Submit</button></div></div></div>}
    </div>
  );
}

function HistoryPage() {
  const [convs, setConvs] = useState([]);
  const [filter, setFilter] = useState("All Ratings");
  useEffect(() => setConvs(JSON.parse(localStorage.getItem("conversations") || "[]")), []);
  const filtered = filter === "All Ratings" ? convs : convs.filter(c => String(c.rating || 4) === filter);
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "240px", padding: "12px", borderRight: "1px solid #ddd" }}><Link to="/" href="/" style={{ textDecoration: "none" }}><div style={{ background: "#ddd6fe", padding: "12px", borderRadius: "10px", cursor: "pointer" }}>💬 Want new suggestion? ↗️</div></Link><Link to="/history" href="/history" style={{ textDecoration: "none" }}><button type="button" style={{ width: "100%", marginTop: "10px", padding: "10px", background: "#ddd6fe", border: "none", borderRadius: "8px" }}>Previous Suggestions</button></Link></div>
      <div style={{ flex: 1, padding: "20px", overflow: "auto" }}><h1>Product Recommendation AI</h1><h2 style={{ textAlign: "center" }}>Previous Suggestions</h2><label>Filter by rating</label><br /><select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "6px", marginTop: "6px" }}><option>All Ratings</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select><h4 style={{ marginTop: "20px" }}>Today's chats</h4>{filtered.map((c, i) => <div key={i} style={{ marginBottom: "12px" }}>{c.messages?.map((m, j) => <div key={j} style={{ background: "#e9d5ff", padding: "8px", marginBottom: "6px", borderRadius: "6px" }}><b>{m.name}</b> {m.text} <small>Rating:{c.rating}</small>{c.feedback && <div>Feedback:{c.feedback}</div>}</div>)}</div>)}</div>
    </div>
  );
}

export default function App() {
  return (<BrowserRouter><Routes><Route path="/" element={<ChatPage />} /><Route path="/history" element={<HistoryPage />} /></Routes></BrowserRouter>);
}