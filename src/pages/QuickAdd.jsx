import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Dummy data ────────────────────────────────────────────────────────────────
const EXPENSE_CATEGORIES = [
  { label: 'Food & Dining',    emoji: '🍜' },
  { label: 'Shopping',         emoji: '🛍️' },
  { label: 'Transportation',   emoji: '🚗' },
  { label: 'Entertainment',    emoji: '🎬' },
  { label: 'Health & Fitness', emoji: '💊' },
  { label: 'Bills & Utilities',emoji: '💡' },
  { label: 'Travel',           emoji: '✈️' },
  { label: 'Other',            emoji: '📦' },
]

const INCOME_CATEGORIES = [
  { label: 'Salary',     emoji: '💼' },
  { label: 'Freelance',  emoji: '💻' },
  { label: 'Investment', emoji: '📈' },
  { label: 'Gift',       emoji: '🎁' },
  { label: 'Refund',     emoji: '↩️' },
  { label: 'Other',      emoji: '💰' },
]

const CREDIT_CARDS = [
  { label: 'Chase Sapphire',   network: 'Visa'   },
  { label: 'Amex Gold',        network: 'Amex'   },
  { label: 'Citi Double Cash', network: 'Visa'   },
]

const PAYMENT_METHODS = ['Cash', 'Debit', 'Credit Card']

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function formatAmount(raw) {
  if (!raw || raw === '0') return '0'
  const [int, dec] = raw.split('.')
  const formatted = parseInt(int || '0', 10).toLocaleString('en-US')
  if (raw.includes('.')) return `${formatted}.${dec ?? ''}`
  return formatted
}

// ── Dropdown picker ───────────────────────────────────────────────────────────
function Picker({ options, selected, onSelect, open, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={ref} className="absolute top-full left-0 z-30 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-[#E9D5FF] bg-white shadow-xl">
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => { onSelect(opt); onClose() }}
          className={`flex w-full items-center gap-2.5 px-4 py-3 text-sm text-[#1C1917] transition-colors hover:bg-[#FAF8FF] ${selected?.label === opt.label ? 'bg-[#F3E8FF] font-medium' : ''}`}
        >
          <span>{opt.emoji ?? opt.network}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

const PAD_KEYS = ['7','8','9','4','5','6','1','2','3','.','0','⌫']

// ── Component ─────────────────────────────────────────────────────────────────
export default function QuickAdd() {
  const navigate = useNavigate()
  const [type, setType]             = useState('expense')
  const [raw, setRaw]               = useState('0')
  const [category, setCategory]     = useState(EXPENSE_CATEGORIES[0])
  const [payMethod, setPayMethod]   = useState('Cash')
  const [creditCard, setCreditCard] = useState(CREDIT_CARDS[0])
  const [note, setNote]             = useState('')
  const [date, setDate]             = useState(todayString())
  const [catOpen, setCatOpen]       = useState(false)
  const [cardOpen, setCardOpen]     = useState(false)

  const isExpense   = type === 'expense'
  const categories  = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const accentColor = isExpense ? '#C4B5FD' : '#86EFAC'

  function switchType(t) {
    setType(t)
    setCategory(t === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0])
    setCatOpen(false)
    setCardOpen(false)
  }

  function handleKey(key) {
    if (key === '⌫') {
      setRaw(prev => { const n = prev.slice(0, -1); return n === '' || n === '-' ? '0' : n })
      return
    }
    if (key === '.') { if (!raw.includes('.')) setRaw(prev => prev + '.'); return }
    if (raw.includes('.') && raw.split('.')[1]?.length >= 2) return
    if (!raw.includes('.') && raw.replace(/^0/, '').length >= 7) return
    setRaw(prev => prev === '0' ? key : prev + key)
  }

  const isEmpty    = raw === '0'
  const hasDecimal = raw.includes('.')

  return (
    <div className="flex h-screen flex-col bg-[#FAF8FF]">

      {/* ── Top bar: drag handle + close ── */}
      <div className="relative flex items-center justify-center pt-3 pb-1 shrink-0">
        <div className="h-1.5 w-10 rounded-full bg-[#E9D5FF]" />
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F3E8FF] text-[#78716C] transition-colors hover:bg-[#E9D5FF]"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Expense / Income toggle ── */}
      <div className="px-6 pt-3 pb-1 shrink-0">
        <div className="flex rounded-2xl border border-[#E9D5FF] bg-white p-1">
          <button
            onClick={() => switchType('expense')}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
              isExpense ? 'bg-[#C4B5FD] text-white shadow-sm' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => switchType('income')}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
              !isExpense ? 'bg-[#86EFAC] text-[#166534] shadow-sm' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* ── Amount display ── */}
      <div className="flex flex-col items-center px-6 pt-4 pb-3 shrink-0">
        <p className="mb-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: accentColor }}>
          Amount
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-light" style={{ color: accentColor }}>$</span>
          <span className={`font-semibold tabular-nums leading-none transition-all ${
            formatAmount(raw).replace(/[^0-9]/g, '').length > 5 ? 'text-5xl' : 'text-6xl'
          } ${isEmpty ? 'opacity-30' : 'text-[#1C1917]'}`}
            style={isEmpty ? { color: accentColor } : {}}
          >
            {formatAmount(raw)}
          </span>
        </div>
      </div>

      {/* ── Category pill ── */}
      <div className="flex justify-center px-6 pb-3 shrink-0">
        <div className="relative">
          <button
            onClick={() => { setCatOpen(o => !o); setCardOpen(false) }}
            className="flex items-center gap-1.5 rounded-full border border-[#E9D5FF] bg-white px-4 py-2 text-sm font-medium text-[#1C1917] shadow-sm transition-colors hover:border-[#C4B5FD]"
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
            <svg className="ml-1 h-3 w-3 text-[#C4B5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Picker options={categories} selected={category} onSelect={setCategory} open={catOpen} onClose={() => setCatOpen(false)} />
        </div>
      </div>

      {/* ── Payment method segmented control (expense only) ── */}
      {isExpense && (
        <div className="px-6 pb-3 shrink-0">
          <div className="flex rounded-2xl border border-[#E9D5FF] bg-white p-1">
            {PAYMENT_METHODS.map(method => (
              <button
                key={method}
                onClick={() => setPayMethod(method)}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                  payMethod === method
                    ? 'bg-[#C4B5FD] text-white shadow-sm'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Credit card sub-selector (Credit Card only) ── */}
      {isExpense && payMethod === 'Credit Card' && (
        <div className="flex justify-center px-6 pb-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => { setCardOpen(o => !o); setCatOpen(false) }}
              className="flex items-center gap-1.5 rounded-full border border-[#C4B5FD] bg-[#F3E8FF] px-4 py-2 text-sm font-medium text-[#1C1917] shadow-sm transition-colors hover:bg-[#E9D5FF]"
            >
              <span>💳</span>
              <span>{creditCard.label}</span>
              <span className="text-[10px] text-[#78716C]">{creditCard.network}</span>
              <svg className="ml-1 h-3 w-3 text-[#C4B5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Picker options={CREDIT_CARDS} selected={creditCard} onSelect={setCreditCard} open={cardOpen} onClose={() => setCardOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Date + Note row ── */}
      <div className="flex gap-2 px-6 pb-4 shrink-0">
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3 text-sm">📅</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="rounded-2xl border border-[#E9D5FF] bg-white py-2.5 pl-9 pr-3 text-sm text-[#1C1917] outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
          />
        </div>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note…"
          className="min-w-0 flex-1 rounded-2xl border border-[#E9D5FF] bg-white px-4 py-2.5 text-sm text-[#1C1917] placeholder-[#C4B5FD]/50 outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
        />
      </div>

      {/* ── Number pad ── */}
      <div className="mx-6 mb-4 grid flex-1 grid-cols-3 gap-2">
        {PAD_KEYS.map(key => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`flex items-center justify-center rounded-2xl text-xl font-medium transition-all active:scale-95 select-none
              ${key === '⌫'
                ? 'bg-[#F3E8FF] text-[#C4B5FD] hover:bg-[#E9D5FF]'
                : key === '.' && hasDecimal
                ? 'cursor-not-allowed border border-[#E9D5FF] bg-white text-[#C4B5FD]/30'
                : 'border border-[#E9D5FF] bg-white text-[#1C1917] hover:border-[#C4B5FD] hover:bg-[#FAF8FF]'
              }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* ── Submit button ── */}
      <div className="px-6 pb-8 shrink-0">
        <button
          disabled={isEmpty}
          className={`w-full rounded-2xl py-4 text-base font-semibold text-[#1C1917] shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
            isExpense
              ? 'bg-[#C4B5FD] hover:bg-[#a78bfa]'
              : 'bg-[#86EFAC] hover:bg-[#4ade80]'
          }`}
        >
          {isExpense ? 'Add Expense' : 'Add Income'}
        </button>
      </div>

    </div>
  )
}
