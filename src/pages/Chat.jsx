import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { responses } from "../data/responses.js";
import Header from "../components/Header.jsx";

export default function ChatPage({ theme, setTheme }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("product");
  const [sel, setSel] = useState(null);
  const nav = useNavigate();

  const find = (t) => Object.keys(responses.products).find(p => t.toLowerCase().includes(p));
  const parse = (t) => { const n = t.match(/\d+/g); if (!n || n.length < 2) return null; return { min: parseInt(n[0]), max: parseInt(n[1]) } };
  const getRec = (p, b) => { const pr = responses.products[p]; let m = pr.budgets.find(x => b.min >= x.min && b.max <= x.max); if (!m) m = pr.budgets[0]; return m.recommendation; };
  
  const start = (name) => { const pr = find(name) || name.toLowerCase(); setSel(pr); setStage("budget"); const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); setMessages([{ from: "user", text: name, name: "You", time: now }, { from: "ai", text: responses.products[pr]?.prompt || responses.fallback, name: "Product Recommendation AI", time: now }]); };
  const onAsk = (e) => { e.preventDefault(); if (!input.trim()) return; const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); let reply = ""; if (messages.length === 0 || stage === "product") { const p = find(input); if (p) { setSel(p); reply = responses.products[p].prompt; setStage("budget"); } else reply = responses.fallback; } else { const b = parse(input); if (b && sel) { reply = getRec(sel, b); setStage("completed"); } else { const p = find(input); if (p) { setSel(p); reply = responses.products[p].prompt; setStage("budget"); } else reply = responses.fallback; } } setMessages([...messages, { from: "user", text: input, name: "You", time: now }, { from: "ai", text: reply, name: "Product Recommendation AI", time: now }]); setInput(""); };
  const save = () => { if (!messages.length) return; const arr = JSON.parse(localStorage.getItem("conversations") || "[]"); arr.push({ id: Date.now(), messages, rating: 4, date: new Date().toISOString() }); localStorage.setItem("conversations", JSON.stringify(arr)); };
  
  const initial = messages.length === 0;

  return (
    <div className="container">
      <div className="sidebar">
        <div className="new-btn" onClick={() => { if (messages.length) save(); setMessages([]); setStage("product"); }}><span>💬 Want new suggestion?</span><span>↗️</span></div>
        <button className="prev-btn" onClick={() => nav("/history")}>Previous Suggestions</button>
      </div>
      <div className="main">
        <Header theme={theme} setTheme={setTheme} />
        {initial ? (
          <div className="center">
            <h2>Hi, Please tell me what you want?</h2><div className="bot">🤖</div>
            <div className="cards">{["Jeans", "Smartphone", "Laptop", "T-Shirt"].map(c => (<div key={c} className="card" onClick={() => start(c)}><b>{c}</b><small>Get immediate AI generated response</small></div>))}</div>
          </div>
        ) : (
          <div className="chat">{messages.map((m, i) => (<div key={i} className="msg"><img src={m.from === "user" ? "https://i.pravatar.cc/40?img=12" : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"} className="av" /><div><b>{m.name}</b><div>{m.text}</div><small>{m.time}</small></div></div>))}</div>
        )}
        <form className="input-area" onSubmit={onAsk}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder={initial ? "Please tell me about your query!" : "Anything Else?"} />
          <button type="submit">Ask</button>
          <button type="button" onClick={(e) => { e.preventDefault(); save(); alert("Saved!"); }}>Save</button>
        </form>
      </div>
    </div>
  );
}