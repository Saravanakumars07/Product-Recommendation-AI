import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function History(){
  const [convs, setConvs] = useState([]);
  useEffect(()=> setConvs(JSON.parse(localStorage.getItem("conversations")||"[]")), []);
  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/"><div className="new-btn">💬 Want new suggestion? ↗️</div></Link>
        <button className="prev-btn active">Previous Suggestions</button>
      </div>
      <div className="main">
        <header><h1>Product Recommendation AI</h1></header>
        <div style={{padding:"20px"}}>
          <h2 style={{textAlign:"center"}}>Previous Suggestions</h2>
          {convs.map((conv,idx)=><div key={idx}>{conv.messages?.map((m,i)=><div key={i} className="msg" style={{background:"#e9d5ff",marginBottom:"8px"}}><div><b>{m.name}</b><div>{m.text}</div></div></div>)}</div>)}
        </div>
      </div>
    </div>
  );
}