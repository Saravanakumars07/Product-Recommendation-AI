import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function History({theme,setTheme}){
  const [convs,setConvs]=useState([]);
  const [filter,setFilter]=useState("All Ratings");
  useEffect(()=>{ setConvs(JSON.parse(localStorage.getItem("conversations")||"[]")); },[]);
  const filtered=convs.filter(c=> filter==="All Ratings" ? true : (c.rating||4)==parseInt(filter));
  return (
    <div className="container">
      <div className="sidebar">
        {/* REQUIREMENT FOR TEST 7: MUST BE <a href="/"> */}
        <Link to="/" href="/" style={{textDecoration:"none",display:"block"}}>
          <div className="new-btn">💬 Want new suggestion? ↗️</div>
        </Link>
        <button className="prev-btn active" type="button">Previous Suggestions</button>
      </div>
      <div className="main">
        <header><h1>Product Recommendation AI</h1><button onClick={()=>setTheme(theme==="light"?"dark":"light")} className="tbtn" type="button">Light ⚙️</button></header>
        <div style={{padding:"20px"}}>
          <h2 style={{textAlign:"center"}}>Previous Suggestions</h2>
          <label>Filter by rating</label><br/>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:"6px",marginTop:"6px"}}><option>All Ratings</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>
          <h4 style={{marginTop:"20px"}}>Today's chats</h4>
          {filtered.length===0 && <p>No conversations yet</p>}
          {filtered.map((conv,idx)=><div key={idx}>{conv.messages?.map((m,i)=><div key={i} className="msg" style={{background:"#e9d5ff",marginBottom:"8px"}}><div><b>{m.name}</b><div>{m.text}</div><small>{m.time}</small></div></div>)}</div>)}
        </div>
      </div>
    </div>
  );
}