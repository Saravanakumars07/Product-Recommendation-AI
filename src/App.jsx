import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/Chat.jsx";
import HistoryPage from "./pages/History.jsx";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => { document.body.setAttribute("data-theme", theme); localStorage.setItem("theme", theme); }, [theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage theme={theme} setTheme={setTheme} />} />
        <Route path="/history" element={<HistoryPage theme={theme} setTheme={setTheme} />} />
      </Routes>
    </BrowserRouter>
  );
}