import { useState, useMemo } from 'react'

// ── Same transaction data (would come from shared store/hook in real app) ──────
const TRANSACTIONS = [
  { id: 1,  type: 'expense', emoji: '☕', name: 'Blue Bottle Coffee',  category: 'Food & Dining',     payment: 'Debit',            amount: 7.50,   date: '2026-04-09', note: 'Morning coffee' },
  { id: 2,  type: 'expense', emoji: '🚇', name: 'Metro Card top-up',   category: 'Transportation',    payment: 'Cash',             amount: 33.00,  date: '2026-04-09', note: '' },
  { id: 21, type: 'income',  emoji: '💼', name: 'Salary',              category: 'Salary',            payment: null,               amount: 4200.00,date: '2026-04-08', note: 'Monthly pay' },
  { id: 3,  type: 'expense', emoji: '🍜', name: 'Sushi dinner',         category: 'Food & Dining',     payment: 'Chase Sapphire',   amount: 42.50,  date: '2026-04-08', note: 'With friends' },
  { id: 4,  type: 'expense', emoji: '🛍️', name: 'Zara',                category: 'Shopping',          payment: 'Amex Gold',        amount: 89.99,  date: '2026-04-08', note: '' },
  { id: 5,  type: 'expense', emoji: '🚗', name: 'Uber',                 category: 'Transportation',    payment: 'Chase Sapphire',   amount: 28.00,  date: '2026-04-07', note: 'Airport ride' },
  { id: 6,  type: 'expense', emoji: '🎬', name: 'Cinema tickets',       category: 'Entertainment',     payment: 'Cash',             amount: 24.00,  date: '2026-04-07', note: '' },
  { id: 7,  type: 'expense', emoji: '🥗', name: 'Sweetgreen',           category: 'Food & Dining',     payment: 'Debit',            amount: 16.50,  date: '2026-04-07', note: 'Lunch' },
  { id: 8,  type: 'expense', emoji: '🛒', name: 'Amazon order',         category: 'Shopping',          payment: 'Citi Double Cash', amount: 156.99, date: '2026-04-06', note: 'Desk lamp' },
  { id: 9,  type: 'expense', emoji: '💡', name: 'Electric bill',         category: 'Bills & Utilities', payment: 'Debit',            amount: 89.50,  date: '2026-04-06', note: '' },
  { id: 22, type: 'income',  emoji: '💻', name: 'Freelance project',    category: 'Freelance',         payment: null,               amount: 850.00, date: '2026-04-05', note: 'Logo design' },
  { id: 10, type: 'expense', emoji: '💊', name: 'Pharmacy',              category: 'Health & Fitness',  payment: 'Cash',             amount: 35.00,  date: '2026-04-05', note: 'Vitamins' },
  { id: 11, type: 'expense', emoji: '🍕', name: 'Dominos',               category: 'Food & Dining',     payment: 'Chase Sapphire',   amount: 31.20,  date: '2026-04-05', note: '' },
  { id: 12, type: 'expense', emoji: '🎬', name: 'Netflix',               category: 'Entertainment',     payment: 'Chase Sapphire',   amount: 15.99,  date: '2026-04-04', note: 'Monthly sub' },
  { id: 13, type: 'expense', emoji: '🏋️', name: 'Gym membership',        category: 'Health & Fitness',  payment: 'Amex Gold',        amount: 45.00,  date: '2026-04-04', note: '' },
  { id: 14, type: 'expense', emoji: '☕', name: 'Starbucks',             category: 'Food & Dining',     payment: 'Debit',            amount: 6.75,   date: '2026-04-03', note: '' },
  { id: 15, type: 'expense', emoji: '✈️', name: 'Flight to NYC',         category: 'Travel',            payment: 'Amex Gold',        amount: 320.00, date: '2026-04-03', note: 'Work trip' },
  { id: 16, type: 'expense', emoji: '🛒', name: 'Whole Foods',           category: 'Food & Dining',     payment: 'Citi Double Cash', amount: 67.40,  date: '2026-04-03', note: 'Weekly groceries' },
  { id: 17, type: 'expense', emoji: '🚗', name: 'Lyft',                  category: 'Transportation',    payment: 'Amex Gold',        amount: 19.50,  date: '2026-04-02', note: '' },
  { id: 18, type: 'expense', emoji: '💈', name: 'Haircut',               category: 'Health & Fitness',  payment: 'Cash',             amount: 40.00,  date: '2026-04-02', note: '' },
  { id: 23, type: 'income',  emoji: '↩️', name: 'Amazon refund',         category: 'Refund',            payment: null,               amount: 45.00,  date: '2026-04-02', note: '' },
  { id: 19, type: 'expense', emoji: '📦', name: 'iCloud storage',        category: 'Bills & Utilities', payment: 'Chase Sapphire',   amount: 2.99,   date: '2026-04-01', note: '' },
  { id: 20, type: 'expense', emoji: '🍣', name: 'Nobu takeout',          category: 'Food & Dining',     payment: 'Amex Gold',        amount: 78.00,  date: '2026-04-01', note: 'Saturday treat' },
  // March data
  { id: 30, type: 'income',  emoji: '💼', name: 'Salary',               category: 'Salary',            payment: null,               amount: 4200.00,date: '2026-03-28', note: 'Monthly pay' },
  { id: 31, type: 'expense', emoji: '🛒', name: 'Target',               category: 'Shopping',          payment: 'Debit',            amount: 112.30, date: '2026-03-27', note: '' },
  { id: 32, type: 'expense', emoji: '🍣', name: 'Omakase dinner',       category: 'Food & Dining',     payment: 'Amex Gold',        amount: 180.00, date: '2026-03-25', note: 'Birthday dinner' },
  { id: 33, type: 'expense', emoji: '💡', name: 'Internet bill',         category: 'Bills & Utilities', payment: 'Chase Sapphire',   amount: 59.99,  date: '2026-03-22', note: '' },
  { id: 34, type: 'expense', emoji: '🚗', name: 'Car wash',             category: 'Transportation',    payment: 'Cash',             amount: 18.00,  date: '2026-03-20', note: '' },
  { id: 35, type: 'income',  emoji: '📈', name: 'Dividend',             category: 'Investment',        payment: null,               amount: 120.00, date: '2026-03-15', note: '' },
  { id: 36, type: 'expense', emoji: '🎬', name: 'Spotify',              category: 'Entertainment',     payment: 'Chase Sapphire',   amount: 9.99,   date: '2026-03-10', note: '' },
  { id: 37, type: 'expense', emoji: '🍜', name: 'Pho lunch',            category: 'Food & Dining',     payment: 'Debit',            amount: 15.50,  date: '2026-03-08', note: '' },
  { id: 38, type: 'expense', emoji: '💊', name: 'Dentist',              category: 'Health & Fitness',  payment: 'Cash',             amount: 200.00, date: '2026-03-05', note: 'Cleaning' },
  // February data
  { id: 40, type: 'income',  emoji: '💼', name: 'Salary',               category: 'Salary',            payment: null,               amount: 4200.00,date: '2026-02-27', note: 'Monthly pay' },
  { id: 41, type: 'expense', emoji: '🎁', name: "Valentine's gifts",    category: 'Shopping',          payment: 'Amex Gold',        amount: 95.00,  date: '2026-02-14', note: '' },
  { id: 42, type: 'expense', emoji: '🍕', name: 'Pizza night',          category: 'Food & Dining',     payment: 'Cash',             amount: 38.00,  date: '2026-02-12', note: '' },
  { id: 43, type: 'expense', emoji: '✈️', name: 'Weekend trip',         category: 'Travel',            payment: 'Chase Sapphire',   amount: 450.00, date: '2026-02-07', note: 'Miami' },
  { id: 44, type: 'income',  emoji: '💻', name: 'Freelance project',    category: 'Freelance',         payment: null,               amount: 1200.00,date: '2026-02-03', note: 'Website redesign' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date      = new Date(y, m - 1, d)
  const today     = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString())     return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// Build a list of available month/year combos from the data
function getAvailableMonths() {
  const seen = new Set()
  const result = []
  TRANSACTIONS.forEach(tx => {
    const [y, m] = tx.date.split('-').map(Number)
    const key = `${y}-${String(m).padStart(2,'0')}`
    if (!seen.has(key)) { seen.add(key); result.push({ year: y, month: m, key }) }
  })
  return result.sort((a, b) => b.key.localeCompare(a.key))
}

const AVAILABLE_MONTHS = getAvailableMonths()

// ── Sub-components ────────────────────────────────────────────────────────────
function TxRow({ tx, isLast }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#FAF8FF] ${!isLast ? 'border-b border-[#F3E8FF]' : ''}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${tx.type === 'income' ? 'bg-[#DCFCE7]' : 'bg-[#F3E8FF]'}`}>
        {tx.emoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-[#1C1917]">{tx.name}</span>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-xs text-[#78716C]">{tx.category}</span>
          {tx.payment && (
            <>
              <span className="text-[#E9D5FF]">·</span>
              <span className="rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[10px] font-medium text-[#7C3AED]">{tx.payment}</span>
            </>
          )}
        </div>
        {tx.note && <span className="mt-0.5 truncate text-xs text-[#78716C] italic">{tx.note}</span>}
      </div>
      <span className={`shrink-0 text-sm font-semibold tabular-nums ${tx.type === 'income' ? 'text-[#16a34a]' : 'text-[#1C1917]'}`}>
        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function History() {
  const today = new Date()
  const [mode, setMode]           = useState('month')   // 'month' | 'custom'
  const [selectedMonth, setSelectedMonth] = useState(AVAILABLE_MONTHS[0])
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo]     = useState('')

  // Filter transactions based on mode
  const filtered = useMemo(() => {
    if (mode === 'month') {
      return TRANSACTIONS.filter(tx => {
        const [y, m] = tx.date.split('-').map(Number)
        return y === selectedMonth.year && m === selectedMonth.month
      })
    }
    // custom range
    if (!customFrom || !customTo) return []
    return TRANSACTIONS.filter(tx => tx.date >= customFrom && tx.date <= customTo)
  }, [mode, selectedMonth, customFrom, customTo])

  // Group by date
  const groups = useMemo(() => {
    const map = {}
    filtered.forEach(tx => {
      if (!map[tx.date]) map[tx.date] = []
      map[tx.date].push(tx)
    })
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  // Summary stats
  const totalIncome   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const net           = totalIncome - totalExpenses
  const netPositive   = net >= 0

  // Period label
  const periodLabel = mode === 'month'
    ? `${MONTHS[selectedMonth.month - 1]} ${selectedMonth.year}`
    : (customFrom && customTo)
      ? `${customFrom} → ${customTo}`
      : 'Select a date range'

  return (
    <div className="flex flex-col pb-4">

      {/* ── Header ── */}
      <div className="px-5 pt-10 pb-4">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-[#1C1917]">History</h1>

        {/* Mode toggle */}
        <div className="mb-4 flex rounded-2xl border border-[#E9D5FF] bg-white p-1">
          <button
            onClick={() => setMode('month')}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${mode === 'month' ? 'bg-[#C4B5FD] text-white shadow-sm' : 'text-[#78716C] hover:text-[#1C1917]'}`}
          >
            By Month
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${mode === 'custom' ? 'bg-[#C4B5FD] text-white shadow-sm' : 'text-[#78716C] hover:text-[#1C1917]'}`}
          >
            Custom Range
          </button>
        </div>

        {/* Month selector */}
        {mode === 'month' && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {AVAILABLE_MONTHS.map(m => (
              <button
                key={m.key}
                onClick={() => setSelectedMonth(m)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedMonth.key === m.key
                    ? 'bg-[#C4B5FD] text-white shadow-sm'
                    : 'border border-[#E9D5FF] bg-white text-[#78716C] hover:border-[#C4B5FD] hover:text-[#1C1917]'
                }`}
              >
                {MONTHS[m.month - 1].slice(0, 3)} {m.year}
              </button>
            ))}
          </div>
        )}

        {/* Custom date range */}
        {mode === 'custom' && (
          <div className="flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-[#78716C]">From</label>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="w-full rounded-2xl border border-[#E9D5FF] bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
              />
            </div>
            <span className="mt-5 text-[#78716C]">→</span>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-[#78716C]">To</label>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="w-full rounded-2xl border border-[#E9D5FF] bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Summary card ── */}
      {filtered.length > 0 && (
        <div className="mx-5 mb-4 rounded-3xl bg-[#C4B5FD] p-5 shadow-sm shadow-[#C4B5FD]/30">
          <p className="mb-3 text-xs font-medium text-white/70">{periodLabel}</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">Income</span>
              <span className="text-lg font-bold tabular-nums text-white leading-tight">
                ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">Expenses</span>
              <span className="text-lg font-bold tabular-nums text-white leading-tight">
                ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">Net</span>
              <span className={`text-lg font-bold tabular-nums leading-tight ${netPositive ? 'text-[#BBF7D0]' : 'text-[#FECDD3]'}`}>
                {netPositive ? '+' : '-'}${Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
          <div className="mt-3 h-px bg-white/20" />
          <p className="mt-2.5 text-xs text-white/60">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* ── Empty states ── */}
      {mode === 'custom' && (!customFrom || !customTo) && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="text-4xl">📅</span>
          <p className="text-sm font-medium text-[#1C1917]">Pick a date range</p>
          <p className="text-xs text-[#78716C]">Select a start and end date above</p>
        </div>
      )}

      {filtered.length === 0 && (mode === 'month' || (customFrom && customTo)) && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="text-4xl">🗂️</span>
          <p className="text-sm font-medium text-[#1C1917]">No transactions</p>
          <p className="text-xs text-[#78716C]">Nothing recorded for this period</p>
        </div>
      )}

      {/* ── Grouped transaction list ── */}
      {groups.length > 0 && (
        <div className="flex flex-col gap-1 px-5">
          {groups.map(([date, txs]) => (
            <div key={date} className="mb-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">{getDateLabel(date)}</span>
                {(() => {
                  const dayIncome   = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
                  const dayExpenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
                  const dayNet      = dayIncome - dayExpenses
                  if (dayIncome > 0 && dayExpenses > 0)
                    return <span className={`text-xs font-medium ${dayNet >= 0 ? 'text-[#16a34a]' : 'text-[#78716C]'}`}>{dayNet >= 0 ? '+' : '-'}${Math.abs(dayNet).toFixed(2)}</span>
                  if (dayIncome > 0) return <span className="text-xs font-medium text-[#16a34a]">+${dayIncome.toFixed(2)}</span>
                  return <span className="text-xs text-[#78716C]">-${dayExpenses.toFixed(2)}</span>
                })()}
              </div>
              <div className="overflow-hidden rounded-3xl border border-[#E9D5FF] bg-white">
                {txs.map((tx, i) => (
                  <TxRow key={tx.id} tx={tx} isLast={i === txs.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
