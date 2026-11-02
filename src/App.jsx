import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat.jsx";
import History from "./pages/History.jsx";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat/>} />
        <Route path="/history" element={<History/>} />
      </Routes>
    </BrowserRouter>
  );
}