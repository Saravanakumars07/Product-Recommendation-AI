import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function ChatPage(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  useEffect(()=>{
    const s=document.createElement('style');
    s.innerHTML=`#nl-badge-frame{display:none!important}`;
    document.head.appendChild(s);
  },[]);
  const ask = (e)=>{
    e.preventDefault();
    if(!input.trim()) return;
    const lower=input.toLowerCase();
    let reply="Sorry, I did not understand your query!";
    if(lower.includes("jeans")||lower.includes("smartphone")||lower.includes("laptop")||lower.includes("t-shirt")||lower.includes("tshirt")){
      reply="Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)";
    }
    setMessages([...messages,{q:input,a:reply}]);
    const convs=JSON.parse(localStorage.getItem("conversations")||"[]");
    convs.push({id:Date.now(), messages:[{from:"user",text:input,name:"You"},{from:"ai",text:reply,name:"Product Recommendation AI"}], rating:4});
    localStorage.setItem("conversations", JSON.stringify(convs));
    setInput("");
  };
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <div style={{width:"240px",padding:"12px",borderRight:"1px solid #ddd"}}>
        <div style={{background:"#ddd6fe",padding:"12px",borderRadius:"10px",cursor:"pointer"}} onClick={()=>setMessages([])}>💬 Want new suggestion? ↗️</div>
        <Link to="/history" href="/history"><button type="button" style={{width:"100%",marginTop:"10px",padding:"10px",background:"#ddd6fe",border:"none",borderRadius:"8px"}}>Previous Suggestions</button></Link>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <h1>Product Recommendation AI</h1>
        <div style={{flex:1,overflow:"auto",padding:"10px"}}>{messages.map((m,i)=><div key={i}><div>You: {m.q}</div><div>AI: {m.a}</div></div>)}</div>
        <form onSubmit={ask} style={{display:"flex",gap:"8px",padding:"14px",paddingRight:"260px",position:"relative",zIndex:9999}}>
          
          
          <input placeholder="Please tell me about your query!" value={input} onChange={e=>setInput(e.target.value)} style={{flex:1,padding:"10px"}} />
          <button type="submit" style={{padding:"10px 20px",zIndex:99999}}>Ask</button>
          <button type="submit" style={{padding:"10px 20px",zIndex:99999}}>Save</button>
        </form>
      </div>
    </div>
  );
}

function HistoryPage(){
  const [convs,setConvs]=useState([]);
  useEffect(()=>setConvs(JSON.parse(localStorage.getItem("conversations")||"[]")),[]);
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <div style={{width:"240px",padding:"12px",borderRight:"1px solid #ddd"}}>
        <Link to="/" href="/"><div style={{background:"#ddd6fe",padding:"12px",borderRadius:"10px"}}>💬 Want new suggestion? ↗️</div></Link>
        <Link to="/history" href="/history"><button type="button" style={{width:"100%",marginTop:"10px",padding:"10px"}}>Previous Suggestions</button></Link>
      </div>
      <div style={{flex:1,padding:"20px"}}>
        <h1>Product Recommendation AI</h1>
        <h2>Previous Suggestions</h2>
        {convs.map((c,i)=><div key={i}>{c.messages?.map((m,j)=><div key={j}>{m.text}</div>)}</div>)}
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