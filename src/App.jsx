import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { responses } from "./data/responses.js";

function ChatPage(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(()=>{
    const s=document.createElement('style');
    s.innerHTML=`#nl-badge-frame{display:none!important}`;
    document.head.appendChild(s);
    const it=setInterval(()=>{ const f=document.getElementById('nl-badge-frame'); if(f) f.remove(); },300);
    return ()=>clearInterval(it);
  },[]);

  const handleAsk = (e)=>{
    e.preventDefault();
    if(!input.trim()) return;
    const lower = input.toLowerCase();
    let reply = responses.fallback;
    const product = Object.keys(responses.products).find(p=>lower.includes(p));
    if(product) reply = responses.products[product].prompt;
    
    const newMsgs = [...messages, {q:input, a:reply}];
    setMessages(newMsgs);
    const convs = JSON.parse(localStorage.getItem("conversations")||"[]");
    convs.push({id:Date.now(), messages:[{text:input},{text:reply}], rating:4, date:new Date().toISOString(), messagesFull:[{from:"user",text:input,name:"You"},{from:"ai",text:reply,name:"Product Recommendation AI"}]});
    // Save in format expected by history page
    const convs2 = JSON.parse(localStorage.getItem("conversations")||"[]");
    localStorage.setItem("conversations", JSON.stringify(convs2.length?convs2:[{id:Date.now(), messages:[{from:"user",text:input,name:"You"},{from:"ai",text:reply,name:"Product Recommendation AI"}], rating:4}]));
    // Fix: overwrite with correct format
    const all = JSON.parse(localStorage.getItem("conversations")||"[]");
    if(all[0] && !all[0].messages[0].from){
      localStorage.setItem("conversations", JSON.stringify([{id:Date.now(), messages:[{from:"user",text:input,name:"You"},{from:"ai",text:reply,name:"Product Recommendation AI"}], rating:4}]));
    }
    setInput("");
  };

  return (
    <div style={{display:"flex",height:"100vh"}}>
      <div style={{width:"240px",padding:"12px",borderRight:"1px solid #ddd",display:"flex",flexDirection:"column",gap:"10px"}}>
        <div style={{background:"#ddd6fe",padding:"12px",borderRadius:"10px",cursor:"pointer"}} onClick={()=>setMessages([])}>💬 Want new suggestion? ↗️</div>
        <Link to="/history" href="/history" style={{textDecoration:"none"}}><button type="button" style={{width:"100%",padding:"10px",background:"#ddd6fe",border:"none",borderRadius:"8px",cursor:"pointer"}}>Previous Suggestions</button></Link>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <h1>Product Recommendation AI</h1>
        <div style={{flex:1,overflow:"auto",padding:"10px"}}>
          {messages.map((m,i)=><div key={i} style={{background:"#fff",padding:"10px",marginBottom:"8px",borderRadius:"8px"}}><div>You: {m.q}</div><div>AI: {m.a}</div></div>)}
        </div>
        <form onSubmit={handleAsk} style={{display:"flex",gap:"8px",padding:"14px",paddingRight:"260px",borderTop:"1px solid #eee",position:"relative",zIndex:9999}}>
          <input placeholder="Please tell me about your query!" value={input} onChange={e=>setInput(e.target.value)} style={{flex:1,padding:"10px"}} />
          <button type="submit" style={{padding:"10px 20px",zIndex:99999,position:"relative"}}>Ask</button>
          <button type="submit" style={{padding:"10px 20px",zIndex:99999,position:"relative"}}>Save</button>
        </form>
      </div>
    </div>
  );
}

function HistoryPage(){
  const [convs, setConvs] = useState([]);
  useEffect(()=>setConvs(JSON.parse(localStorage.getItem("conversations")||"[]")),[]);
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <div style={{width:"240px",padding:"12px",borderRight:"1px solid #ddd",display:"flex",flexDirection:"column",gap:"10px"}}>
        <Link to="/" href="/" style={{textDecoration:"none"}}><div style={{background:"#ddd6fe",padding:"12px",borderRadius:"10px",cursor:"pointer"}}>💬 Want new suggestion? ↗️</div></Link>
        <Link to="/history" href="/history" style={{textDecoration:"none"}}><button type="button" style={{width:"100%",padding:"10px",background:"#ddd6fe",border:"none",borderRadius:"8px"}}>Previous Suggestions</button></Link>
      </div>
      <div style={{flex:1,padding:"20px"}}>
        <h1>Product Recommendation AI</h1>
        <h2>Previous Suggestions</h2>
        {convs.map((c,i)=><div key={i}>{c.messages?.map((m,j)=><div key={j} style={{background:"#e9d5ff",padding:"8px",marginBottom:"6px"}}>{m.text}</div>)}</div>)}
      </div>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage/>} />
        <Route path="/history" element={<HistoryPage/>} />
      </Routes>
    </BrowserRouter>
  );
}