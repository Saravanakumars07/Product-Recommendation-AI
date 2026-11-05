import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'

// ===== PREDEFINED JSON - Step 1 / Step 4 =====
const DATA = {
  "jeans": [
    { min: 0, max: 1000, text: "For Jeans in budget 0 - 1000, we recommend Levi's 511 Slim Fit Jeans - comfortable and durable." },
    { min: 1000, max: 3000, text: "For Jeans in budget 1000 - 3000, we recommend Wrangler Regular Fit Jeans - great quality." }
  ],
  "smartphone": [
    { min: 0, max: 15000, text: "For Smartphone in budget 0 - 15000, we recommend Redmi Note 13 - great value." },
    { min: 15000, max: 50000, text: "For Smartphone in budget 15000 - 50000, we recommend Samsung Galaxy A55 - excellent camera." }
  ],
  "laptop": [
    { min: 0, max: 40000, text: "For Laptop in budget 0 - 40000, we recommend HP 15s - best for students." },
    { min: 40000, max: 100000, text: "For Laptop in budget 40000 - 100000, we recommend MacBook Air M2 - powerful and light." }
  ],
  "t-shirt": [
    { min: 0, max: 1000, text: "For T-Shirt in budget 0 - 1000, we recommend Roadster Cotton T-Shirt - soft and comfortable." },
    { min: 1000, max: 3000, text: "For T-Shirt in budget 1000 - 3000, we recommend Nike Dri-FIT T-Shirt - premium sporty fit." }
  ]
}
const PRODUCTS = ["Jeans", "Smartphone", "Laptop", "T-Shirt"]
const FALLBACK = "Sorry, I did not understand your query!"

function ChatPage({ theme, setTheme }) {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! Ask me for Jeans, Smartphone, Laptop or T-Shirt. Then tell me your budget like 500 - 1000.' }])
  const [input, setInput] = useState('')
  const [stage, setStage] = useState('product') // product | budget | done
  const [product, setProduct] = useState('')
  const [msgFeedback, setMsgFeedback] = useState({}) // index -> {type, stars, feedback}
  const [showModal, setShowModal] = useState(null) // msg index for thumbs-down
  const [modalText, setModalText] = useState('')
  const [starFor, setStarFor] = useState(null)
  const [endRating, setEndRating] = useState(0)
  const [endFeedback, setEndFeedback] = useState('')
  const navigate = useNavigate()

  const findProduct = (q) => {
    const lower = q.toLowerCase()
    if (lower.includes('jean')) return 'jeans'
    if (lower.includes('phone') || lower.includes('smartphone')) return 'smartphone'
    if (lower.includes('laptop')) return 'laptop'
    if (lower.includes('t-shirt') || lower.includes('tshirt') || lower.includes('shirt')) return 't-shirt'
    return null
  }

  const handleAsk = (e) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    const newMsgs = [...messages, { from: 'user', text: q }]
    let botText = FALLBACK
    if (stage === 'product') {
      const p = findProduct(q)
      if (p) { setProduct(p); setStage('budget'); botText = `Great! You want ${p}. Please tell me your budget range like 500 - 1000.` }
    } else if (stage === 'budget') {
      const nums = q.match(/\d+/g)
      if (nums && nums.length >= 2) {
        const min = parseInt(nums[0]), max = parseInt(nums[1])
        const found = DATA[product]?.find(r => min >= r.min && max <= r.max || min >= r.min && min <= r.max)
        if (found) { botText = found.text; setStage('done') }
        else botText = `No exact match for ${product} in ${min} - ${max}. Try 500 - 1000 or 1000 - 3000.`
      } else botText = `Please give a valid range like 500 - 1000.`
    } else {
      const p = findProduct(q)
      if (p) { setProduct(p); setStage('budget'); botText = `Great! You want ${p}. Please tell me your budget range like 500 - 1000.` }
    }
    setMessages([...newMsgs, { from: 'bot', text: botText }])
    setInput('')
  }

  const saveConversation = () => {
    const saved = JSON.parse(localStorage.getItem('conversations') || '[]')
    saved.push({ id: Date.now(), messages, rating: endRating, feedback: endFeedback, msgFeedback, date: new Date().toLocaleString() })
    localStorage.setItem('conversations', JSON.stringify(saved))
  }

  const handleSave = (e) => { e.preventDefault(); saveConversation(); alert('Conversation saved! Check Past Conversations.') }

  const handleNew = () => {
    saveConversation()
    setMessages([{ from: 'bot', text: 'Hi! Ask me for Jeans, Smartphone, Laptop or T-Shirt.' }])
    setStage('product'); setProduct(''); setEndRating(0); setEndFeedback(''); setMsgFeedback({})
  }

  const submitModal = () => {
    setMsgFeedback({ ...msgFeedback, [showModal]: { ...msgFeedback[showModal], type: 'down', feedback: modalText } })
    localStorage.setItem('feedback_' + showModal, modalText)
    setShowModal(null); setModalText('')
  }

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Product Recommendation AI</h1>
        <div>
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
          <Link to="/history"><button type="button">Previous Recommendations</button></Link>
        </div>
      </header>

      <div className="quick">
        {PRODUCTS.map(p => <button key={p} type="button" onClick={() => { setInput(p); }}>{p}</button>)}
      </div>

      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.from}`}>
            <p>{m.text}</p>
            {m.from === 'bot' && (
              <div className="thumbs">
                <button type="button" onClick={() => setStarFor(i)}>👍</button>
                <button type="button" onClick={() => setShowModal(i)}>👎</button>
                {starFor === i && <span>{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => { setMsgFeedback({ ...msgFeedback, [i]: { type: 'up', stars: s } }); setStarFor(null) }}>{s <= (msgFeedback[i]?.stars || 0) ? '★' : '☆'}</button>)}</span>}
                {msgFeedback[i]?.stars && <small> Rated {msgFeedback[i].stars}/5</small>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* End of conversation feedback - Step 6 */}
      <div className="end-feedback">
        <p>Rate this conversation:</p>
        <div>{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setEndRating(s)}>{s <= endRating ? '★' : '☆'}</button>)}</div>
        <textarea placeholder="Give subjective feedback..." value={endFeedback} onChange={(e) => setEndFeedback(e.target.value)} />
      </div>

      <form onSubmit={handleAsk} className="input-row">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Please tell me about your query!" />
        <button type="submit">Ask</button>
        <button type="submit" onClick={handleSave}>Save</button>
      </form>
      <button type="button" className="new-btn" onClick={handleNew}>Want new suggestion?</button>

      {showModal !== null && (
        <div className="modal">
          <div className="modal-box">
            <h3>Provide Additional Feedback</h3>
            <textarea value={modalText} onChange={(e) => setModalText(e.target.value)} placeholder="Tell us what went wrong..." />
            <button type="button" onClick={submitModal}>Submit</button>
            <button type="button" onClick={() => setShowModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

function HistoryPage({ theme, setTheme }) {
  const [saved, setSaved] = useState([])
  const [filter, setFilter] = useState('All Ratings')
  useEffect(() => { setSaved(JSON.parse(localStorage.getItem('conversations') || '[]')) }, [])
  const filtered = filter === 'All Ratings' ? saved : saved.filter(c => String(c.rating) === String(filter))
  return (
    <div className={`app ${theme}`}>
      <header><h1>Product Recommendation AI</h1><Link to="/"><button type="button">Back to Chat</button></Link></header>
      <h2>Past Conversations</h2>
      <label>Filter by rating</label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option>All Ratings</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
      </select>
      {filtered.length === 0 ? <p>No conversations yet.</p> : filtered.map(c => (
        <div key={c.id} className="saved-card">
          <p><b>Rating:</b> {c.rating} / 5</p><p><b>Feedback:</b> {c.feedback}</p>
          {c.messages.map((m, i) => <p key={i}>{m.from}: {m.text}</p>)}
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState('light')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage theme={theme} setTheme={setTheme} />} />
        <Route path="/history" element={<HistoryPage theme={theme} setTheme={setTheme} />} />
      </Routes>
    </BrowserRouter>
  )
}