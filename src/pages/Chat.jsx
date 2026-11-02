import { useState } from "react";
import { Link } from "react-router-dom";
import { responses } from "../data/responses.js";

export default function Chat(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const findProduct = (text) => Object.keys(responses.products).find(p => text.toLowerCase().includes(p));

  const handleAsk = (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    const userMsg = { from: "user", text: input, name: "You", time: new Date().toLocaleTimeString() };
    const product = findProduct(input);
    const replyText = product ? responses.products[product].prompt : responses.fallback;
    const aiMsg = { from: "ai", text: replyText, name: "Product Recommendation AI", time: new Date().toLocaleTimeString() };
    const newMessages = [...messages, userMsg, aiMsg];
    setMessages(newMessages);
    const all = JSON.parse(localStorage.getItem("conversations")||"[]");
    all.push({id:Date.now(), messages:newMessages});
    localStorage.setItem("conversations", JSON.stringify(all));
    setInput("");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="new-btn" onClick={()=>setMessages([])}>💬 Want new suggestion? ↗️</div>
        <Link to="/history"><button className="prev-btn" style={{width:"100%"}}>Previous Suggestions</button></Link>
      </div>
      <div className="main">
        <header><h1>Product Recommendation AI</h1></header>
        {messages.length===0 ? (
          <div className="center"><h2>Hi, Please tell me what you want?</h2><div className="bot">🤖</div>
            <div className="cards">{["Jeans","Smartphone","Laptop","T-Shirt"].map(c=>(<div key={c} className="card" onClick={()=>setInput(c)}><b>{c}</b><small>Get immediate AI response</small></div>))}</div>
          </div>
        ) : (
          <div className="chat">{messages.map((m,i)=>(<div key={i} className="msg"><div><b>{m.name}</b><div>{m.text}</div></div></div>))}</div>
        )}
        <form className="input-area" onSubmit={handleAsk}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Please tell me about your query!" />
          <button type="submit">Ask</button>
        </form>
      </div>
    </div>
  );
}