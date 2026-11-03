import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Chat from "./pages/Chat.jsx";
import History from "./pages/History.jsx";

export default function App(){
  const [theme,setTheme]=useState(localStorage.getItem("theme")||"light");
  useEffect(()=>{
    document.body.setAttribute("data-theme",theme);
    localStorage.setItem("theme",theme);
    const it=setInterval(()=>{ const f=document.getElementById('nl-badge-frame'); if(f) f.style.display='none'; },500);
    return ()=>clearInterval(it);
  },[theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat theme={theme} setTheme={setTheme}/>} />
        <Route path="/history" element={<History theme={theme} setTheme={setTheme}/>} />
      </Routes>
    </BrowserRouter>
  );
}