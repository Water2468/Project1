import { useState, useMemo } from 'react'

// ── Dummy data ────────────────────────────────────────────────────────────────
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
]

const CATEGORIES = ['Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 'Health & Fitness', 'Bills & Utilities', 'Travel']
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Refund']
const PAYMENTS   = ['Cash', 'Debit', 'Chase Sapphire', 'Amex Gold', 'Citi Double Cash']
const TYPES      = ['All', 'Expenses', 'Income']

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date      = new Date(y, m - 1, d)
  const today     = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString())     return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4 text-[#C4B5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Transactions() {
  const [search,      setSearch]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState('All')
  const [catFilter,   setCatFilter]   = useState(null)
  const [payFilter,   setPayFilter]   = useState(null)

  // Which category list to show depends on type filter
  const visibleCategories = typeFilter === 'Income' ? INCOME_CATEGORIES : CATEGORIES

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return TRANSACTIONS.filter(tx => {
      if (typeFilter === 'Expenses' && tx.type !== 'expense') return false
      if (typeFilter === 'Income'   && tx.type !== 'income')  return false
      if (catFilter && tx.category !== catFilter) return false
      if (payFilter && tx.payment  !== payFilter) return false
      if (q && !tx.name.toLowerCase().includes(q) && !tx.note.toLowerCase().includes(q)) return false
      return true
    })
  }, [search, typeFilter, catFilter, payFilter])

  // Group by date, sorted newest first
  const groups = useMemo(() => {
    const map = {}
    filtered.forEach(tx => {
      if (!map[tx.date]) map[tx.date] = []
      map[tx.date].push(tx)
    })
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  const totalFiltered = filtered.reduce((s, tx) => s + tx.amount, 0)
  const activeFilters = [catFilter, payFilter, typeFilter !== 'All' ? typeFilter : null].filter(Boolean).length

  function clearFilters() { setCatFilter(null); setPayFilter(null); setSearch(''); setTypeFilter('All') }

  function handleTypeSwitch(t) { setTypeFilter(t); setCatFilter(null) }

  return (
    <div className="flex flex-col pb-4">

      {/* ── Header ── */}
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">Transactions</h1>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="text-xs font-medium text-[#C4B5FD] hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions…"
            className="w-full rounded-2xl border border-[#E9D5FF] bg-white py-3 pl-10 pr-4 text-sm text-[#1C1917] placeholder-[#C4B5FD]/50 outline-none transition-colors focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Type filter chips */}
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TYPES.map(t => (
            <Chip key={t} label={t} active={typeFilter === t} onClick={() => handleTypeSwitch(t)} />
          ))}
        </div>

        {/* Category filter chips */}
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Chip label="All" active={!catFilter} onClick={() => setCatFilter(null)} />
          {visibleCategories.map(c => (
            <Chip key={c} label={c} active={catFilter === c} onClick={() => setCatFilter(catFilter === c ? null : c)} />
          ))}
        </div>

        {/* Payment filter chips (expenses only) */}
        {typeFilter !== 'Income' && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Chip label="All" active={!payFilter} onClick={() => setPayFilter(null)} />
            {PAYMENTS.map(p => (
              <Chip key={p} label={p} active={payFilter === p} onClick={() => setPayFilter(payFilter === p ? null : p)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Results summary ── */}
      {(activeFilters > 0 || search) && (
        <div className="mx-5 mb-3 flex items-center justify-between rounded-2xl border border-[#E9D5FF] bg-white px-4 py-2.5">
          <span className="text-xs text-[#78716C]">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
          {typeFilter === 'Income' ? (
            <span className="text-xs font-semibold text-[#16a34a]">+${totalFiltered.toFixed(2)}</span>
          ) : typeFilter === 'Expenses' ? (
            <span className="text-xs font-semibold text-[#1C1917]">-${totalFiltered.toFixed(2)}</span>
          ) : (
            <span className="text-xs font-semibold text-[#1C1917]">${totalFiltered.toFixed(2)}</span>
          )}
        </div>
      )}

      {/* ── Grouped list ── */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-sm font-medium text-[#1C1917]">No transactions found</p>
          <p className="text-xs text-[#78716C]">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 px-5">
          {groups.map(([date, txs]) => (
            <div key={date} className="mb-2">
              {/* Date header */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">{getDateLabel(date)}</span>
                {(() => {
                  const dayIncome   = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
                  const dayExpenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
                  const dayNet      = dayIncome - dayExpenses
                  if (dayIncome > 0 && dayExpenses > 0) {
                    return <span className={`text-xs font-medium ${dayNet >= 0 ? 'text-[#16a34a]' : 'text-[#78716C]'}`}>{dayNet >= 0 ? '+' : '-'}${Math.abs(dayNet).toFixed(2)}</span>
                  }
                  if (dayIncome > 0) return <span className="text-xs font-medium text-[#16a34a]">+${dayIncome.toFixed(2)}</span>
                  return <span className="text-xs text-[#78716C]">-${dayExpenses.toFixed(2)}</span>
                })()}
              </div>

              {/* Transactions for this date */}
              <div className="overflow-hidden rounded-3xl border border-[#E9D5FF] bg-white">
                {txs.map((tx, i) => (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#FAF8FF] ${
                      i < txs.length - 1 ? 'border-b border-[#F3E8FF]' : ''
                    }`}
                  >
                    {/* Emoji icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${
                      tx.type === 'income' ? 'bg-[#DCFCE7]' : 'bg-[#F3E8FF]'
                    }`}>
                      {tx.emoji}
                    </div>

                    {/* Name + meta */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-[#1C1917]">{tx.name}</span>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-xs text-[#78716C]">{tx.category}</span>
                        {tx.payment && (
                          <>
                            <span className="text-[#E9D5FF]">·</span>
                            <span className="rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[10px] font-medium text-[#7C3AED]">
                              {tx.payment}
                            </span>
                          </>
                        )}
                      </div>
                      {tx.note && (
                        <span className="mt-0.5 truncate text-xs text-[#78716C] italic">{tx.note}</span>
                      )}
                    </div>

                    {/* Amount */}
                    <span className={`shrink-0 text-sm font-semibold tabular-nums ${
                      tx.type === 'income' ? 'text-[#16a34a]' : 'text-[#1C1917]'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
        active
          ? 'bg-[#C4B5FD] text-white shadow-sm'
          : 'border border-[#E9D5FF] bg-white text-[#78716C] hover:border-[#C4B5FD] hover:text-[#1C1917]'
      }`}
    >
      {label}
    </button>
  )
}
