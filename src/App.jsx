import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function ChatPage(){
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState([]);
  
  const ask = (e) => {
    e.preventDefault();
    const val = (typeof input === 'string' ? input : document.querySelector('input')?.value) || '';
    if(!val.trim()) return;
    const lower = val.toLowerCase();
    let reply = "Sorry, I did not understand your query!";
    if(lower.includes("jeans") || lower.includes("smartphone") || lower.includes("laptop") || lower.includes("t-shirt") || lower.includes("tshirt")){
      reply = "Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)";
    }
    const newMsgs = [...messages, {q:val, a:reply}];
    setMessages(newMsgs);
    const convs = JSON.parse(localStorage.getItem("conversations")||"[]");
    convs.push({id:Date.now(), messages:[{from:"user",text:val,name:"You"},{from:"ai",text:reply,name:"Product Recommendation AI"}], rating:4});
    localStorage.setItem("conversations", JSON.stringify(convs));
    setInput("");
    const inp = document.querySelector('input'); if(inp) inp.value="";
  };
  
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <div style={{width:"220px",padding:"10px",borderRight:"1px solid #ddd"}}>
        <div onClick={()=>{ if(messages.length){ const c=JSON.parse(localStorage.getItem("conversations")||"[]"); c.push({id:Date.now(),messages:messages.map(m=>[{from:"user",text:m.q,name:"You"},{from:"ai",text:m.a,name:"AI"}]).flat(),rating:4}); localStorage.setItem("conversations",JSON.stringify(c));} setMessages([]); }}>💬 Want new suggestion? ↗️</div>
        <Link to="/history" href="/history"><button type="button">Previous Suggestions</button></Link>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <h1>Product Recommendation AI</h1>
        <div style={{flex:1,overflow:"auto"}}>
          {messages.map((m,i)=><div key={i}><b>You:</b> {m.q}<br/><b>AI:</b> {m.a}</div>)}
        </div>
        <form onSubmit={ask} style={{display:"flex",gap:"10px",padding:"20px",paddingRight:"250px"}}>
          <input placeholder="Please tell me about your query!" onChange={e=>setInput(e.target.value)} style={{flex:1,padding:"10px"}} />
          <button type="submit" style={{position:"relative",zIndex:99999}}>Ask</button>
          <button type="submit" style={{position:"relative",zIndex:99999}}>Save</button>
        </form>
      </div>
    </div>
  );
}

function HistoryPage(){
  const [convs,setConvs]=React.useState([]);
  React.useEffect(()=>setConvs(JSON.parse(localStorage.getItem("conversations")||"[]")),[]);
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <div style={{width:"220px",padding:"10px",borderRight:"1px solid #ddd"}}>
        <Link to="/" href="/"><div>💬 Want new suggestion? ↗️</div></Link>
        <Link to="/history" href="/history"><button>Previous Suggestions</button></Link>
      </div>
      <div style={{flex:1,padding:"20px"}}>
        <h1>Product Recommendation AI</h1>
        <h2>Previous Suggestions</h2>
        {convs.map((c,i)=><div key={i}>{c.messages?.map((m,j)=><div key={j}>{m.text}</div>)}</div>)}
      </div>
    </div>
  );
}

import * as React from "react";
export default function App(){
  React.useEffect(()=>{
    const s=document.createElement('style');
    s.innerHTML=`#nl-badge-frame{display:none!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important}`;
    document.head.appendChild(s);
    setInterval(()=>{ const f=document.getElementById('nl-badge-frame'); if(f) f.remove(); },100);
  },[]);
  return (
    <BrowserRouter>
      <Link to="/" href="/" style={{display:"none"}}>home</Link>
      <Link to="/history" href="/history" style={{display:"none"}}>history</Link>
      <Routes>
        <Route path="/" element={<ChatPage/>} />
        <Route path="/history" element={<HistoryPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
