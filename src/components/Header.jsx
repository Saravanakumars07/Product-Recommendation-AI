export default function Header({ theme, setTheme }) {
  return (
    <header>
      <h1>Product Recommendation AI</h1>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="tbtn">
        Light ⚙️
      </button>
    </header>
  );
}