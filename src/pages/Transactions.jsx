import { useState, useMemo } from 'react'
import { useCategories } from '../lib/categoriesContext'

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
  // March
  { id: 30, type: 'income',  emoji: '💼', name: 'Salary',               category: 'Salary',            payment: null,               amount: 4200.00,date: '2026-03-28', note: 'Monthly pay' },
  { id: 31, type: 'expense', emoji: '🛒', name: 'Target',               category: 'Shopping',          payment: 'Debit',            amount: 112.30, date: '2026-03-27', note: '' },
  { id: 32, type: 'expense', emoji: '🍣', name: 'Omakase dinner',       category: 'Food & Dining',     payment: 'Amex Gold',        amount: 180.00, date: '2026-03-25', note: 'Birthday dinner' },
  { id: 33, type: 'expense', emoji: '💡', name: 'Internet bill',         category: 'Bills & Utilities', payment: 'Chase Sapphire',   amount: 59.99,  date: '2026-03-22', note: '' },
  { id: 34, type: 'expense', emoji: '🚗', name: 'Car wash',             category: 'Transportation',    payment: 'Cash',             amount: 18.00,  date: '2026-03-20', note: '' },
  { id: 35, type: 'income',  emoji: '📈', name: 'Dividend',             category: 'Investment',        payment: null,               amount: 120.00, date: '2026-03-15', note: '' },
  { id: 36, type: 'expense', emoji: '🎬', name: 'Spotify',              category: 'Entertainment',     payment: 'Chase Sapphire',   amount: 9.99,   date: '2026-03-10', note: '' },
  { id: 37, type: 'expense', emoji: '🍜', name: 'Pho lunch',            category: 'Food & Dining',     payment: 'Debit',            amount: 15.50,  date: '2026-03-08', note: '' },
  { id: 38, type: 'expense', emoji: '💊', name: 'Dentist',              category: 'Health & Fitness',  payment: 'Cash',             amount: 200.00, date: '2026-03-05', note: 'Cleaning' },
  // February
  { id: 40, type: 'income',  emoji: '💼', name: 'Salary',               category: 'Salary',            payment: null,               amount: 4200.00,date: '2026-02-27', note: 'Monthly pay' },
  { id: 41, type: 'expense', emoji: '🎁', name: "Valentine's gifts",    category: 'Shopping',          payment: 'Amex Gold',        amount: 95.00,  date: '2026-02-14', note: '' },
  { id: 42, type: 'expense', emoji: '🍕', name: 'Pizza night',          category: 'Food & Dining',     payment: 'Cash',             amount: 38.00,  date: '2026-02-12', note: '' },
  { id: 43, type: 'expense', emoji: '✈️', name: 'Weekend trip',         category: 'Travel',            payment: 'Chase Sapphire',   amount: 450.00, date: '2026-02-07', note: 'Miami' },
  { id: 44, type: 'income',  emoji: '💻', name: 'Freelance project',    category: 'Freelance',         payment: null,               amount: 1200.00,date: '2026-02-03', note: 'Website redesign' },
]

export { TRANSACTIONS }

const PAYMENTS = ['Cash', 'Debit', 'Chase Sapphire', 'Amex Gold', 'Citi Double Cash']
const TYPES    = ['All', 'Expenses', 'Income']
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']

// ── Helpers ───────────────────────────────────────────────────────────────────
function getAvailableMonths() {
  const seen = new Set()
  const result = []
  TRANSACTIONS.forEach(tx => {
    const [y, m] = tx.date.split('-').map(Number)
    const key = `${y}-${String(m).padStart(2, '0')}`
    if (!seen.has(key)) { seen.add(key); result.push({ year: y, month: m, key }) }
  })
  return result.sort((a, b) => b.key.localeCompare(a.key))
}
const AVAILABLE_MONTHS = getAvailableMonths()

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

// ── Main component ────────────────────────────────────────────────────────────
export default function Transactions() {
  const { expenseCategories, incomeCategories } = useCategories()

  // Period state
  const [periodMode,     setPeriodMode]     = useState('month')   // 'month' | 'custom' | 'all'
  const [selectedMonth,  setSelectedMonth]  = useState(AVAILABLE_MONTHS[0])
  const [customFrom,     setCustomFrom]     = useState('')
  const [customTo,       setCustomTo]       = useState('')
  const [periodOpen,     setPeriodOpen]     = useState(false)

  // Filter state
  const [search,      setSearch]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState('All')
  const [catFilter,   setCatFilter]   = useState(null)
  const [payFilter,   setPayFilter]   = useState(null)
  const [sheetOpen,   setSheetOpen]   = useState(false)

  // Period label for button
  const periodLabel = periodMode === 'all'
    ? 'All time'
    : periodMode === 'month'
      ? `${MONTHS[selectedMonth.month - 1].slice(0,3)} ${selectedMonth.year}`
      : (customFrom && customTo) ? `${customFrom} → ${customTo}` : 'Custom'

  // Apply period filter first
  const periodFiltered = useMemo(() => {
    if (periodMode === 'all') return TRANSACTIONS
    if (periodMode === 'month') {
      return TRANSACTIONS.filter(tx => {
        const [y, m] = tx.date.split('-').map(Number)
        return y === selectedMonth.year && m === selectedMonth.month
      })
    }
    if (!customFrom || !customTo) return []
    return TRANSACTIONS.filter(tx => tx.date >= customFrom && tx.date <= customTo)
  }, [periodMode, selectedMonth, customFrom, customTo])

  // Then apply search/type/cat/pay filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return periodFiltered.filter(tx => {
      if (typeFilter === 'Expenses' && tx.type !== 'expense') return false
      if (typeFilter === 'Income'   && tx.type !== 'income')  return false
      if (catFilter && tx.category !== catFilter) return false
      if (payFilter && tx.payment  !== payFilter) return false
      if (q && !tx.name.toLowerCase().includes(q) && !tx.note.toLowerCase().includes(q)) return false
      return true
    })
  }, [periodFiltered, search, typeFilter, catFilter, payFilter])

  // Group by date
  const groups = useMemo(() => {
    const map = {}
    filtered.forEach(tx => {
      if (!map[tx.date]) map[tx.date] = []
      map[tx.date].push(tx)
    })
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  const totalIncome   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const activeFilters = [catFilter, payFilter, typeFilter !== 'All' ? typeFilter : null].filter(Boolean).length

  function clearFilters() { setCatFilter(null); setPayFilter(null); setSearch(''); setTypeFilter('All') }

  return (
    <div className="flex flex-col pb-4">

      {/* ── Header ── */}
      <div className="px-5 pt-10 pb-3">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-[#1C1917]">Transactions</h1>

        {/* Period selector button */}
        <button
          onClick={() => setPeriodOpen(true)}
          className="mb-3 flex w-full items-center justify-between rounded-2xl border border-[#E9D5FF] bg-white px-4 py-3 text-sm transition-colors hover:border-[#C4B5FD]"
        >
          <div className="flex items-center gap-2 text-[#1C1917] font-medium">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-[#C4B5FD]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {periodLabel}
          </div>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C4B5FD" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Search + filter button row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
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
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setSheetOpen(true)}
            className={`relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl border transition-all ${
              activeFilters > 0
                ? 'border-[#C4B5FD] bg-[#C4B5FD] text-white shadow-sm'
                : 'border-[#E9D5FF] bg-white text-[#78716C] hover:border-[#C4B5FD]'
            }`}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 10h10M11 16h2" />
            </svg>
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7C3AED] text-[9px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Active filter pills */}
        {activeFilters > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {typeFilter !== 'All' && <ActivePill label={typeFilter} onRemove={() => setTypeFilter('All')} />}
            {catFilter  && <ActivePill label={catFilter}  onRemove={() => setCatFilter(null)} />}
            {payFilter  && <ActivePill label={payFilter}  onRemove={() => setPayFilter(null)} />}
            <button onClick={clearFilters} className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">Clear all</button>
          </div>
        )}
      </div>

      {/* ── Summary bar ── */}
      {filtered.length > 0 && (
        <div className="mx-5 mb-3 flex items-center justify-between rounded-2xl border border-[#E9D5FF] bg-white px-4 py-2.5">
          <span className="text-xs text-[#78716C]">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-3">
            {totalIncome > 0 && <span className="text-xs font-semibold text-[#16a34a]">+${totalIncome.toFixed(2)}</span>}
            {totalExpenses > 0 && <span className="text-xs font-semibold text-[#1C1917]">-${totalExpenses.toFixed(2)}</span>}
          </div>
        </div>
      )}

      {/* ── Grouped list ── */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-sm font-medium text-[#1C1917]">No transactions found</p>
          <p className="text-xs text-[#78716C]">Try adjusting your filters or period</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 px-5">
          {groups.map(([date, txs]) => (
            <div key={date} className="mb-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">{getDateLabel(date)}</span>
                {(() => {
                  const dayInc = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
                  const dayExp = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
                  const dayNet = dayInc - dayExp
                  if (dayInc > 0 && dayExp > 0)
                    return <span className={`text-xs font-medium ${dayNet >= 0 ? 'text-[#16a34a]' : 'text-[#78716C]'}`}>{dayNet >= 0 ? '+' : '-'}${Math.abs(dayNet).toFixed(2)}</span>
                  if (dayInc > 0) return <span className="text-xs font-medium text-[#16a34a]">+${dayInc.toFixed(2)}</span>
                  return <span className="text-xs text-[#78716C]">-${dayExp.toFixed(2)}</span>
                })()}
              </div>
              <div className="overflow-hidden rounded-3xl border border-[#E9D5FF] bg-white">
                {txs.map((tx, i) => (
                  <div key={tx.id} className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#FAF8FF] ${i < txs.length - 1 ? 'border-b border-[#F3E8FF]' : ''}`}>
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
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Period sheet ── */}
      <PeriodSheet
        open={periodOpen}
        onClose={() => setPeriodOpen(false)}
        periodMode={periodMode}
        setPeriodMode={setPeriodMode}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        customFrom={customFrom}
        customTo={customTo}
        setCustomFrom={setCustomFrom}
        setCustomTo={setCustomTo}
      />

      {/* ── Filter sheet ── */}
      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        typeFilter={typeFilter}
        catFilter={catFilter}
        payFilter={payFilter}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onType={t => { setTypeFilter(t); setCatFilter(null) }}
        onCat={c => setCatFilter(c)}
        onPay={p => setPayFilter(p)}
        onClear={clearFilters}
      />
    </div>
  )
}

// ── Period sheet ──────────────────────────────────────────────────────────────
function PeriodSheet({ open, onClose, periodMode, setPeriodMode, selectedMonth, setSelectedMonth, customFrom, customTo, setCustomFrom, setCustomTo }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl">
        <div className="mb-5 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-[#E9D5FF]" />
        </div>
        <h3 className="mb-5 text-base font-bold text-[#1C1917]">Select period</h3>

        {/* Mode tabs */}
        <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border border-[#E9D5FF] bg-[#FAF8FF] p-1">
          {[['all','All time'],['month','By month'],['custom','Custom']].map(([m, label]) => (
            <button key={m} onClick={() => setPeriodMode(m)}
              className={`rounded-xl py-2 text-xs font-semibold transition-all ${periodMode === m ? 'bg-[#C4B5FD] text-white shadow-sm' : 'text-[#78716C] hover:text-[#1C1917]'}`}
            >{label}</button>
          ))}
        </div>

        {/* Month picker */}
        {periodMode === 'month' && (
          <div className="mb-5 flex flex-wrap gap-2">
            {AVAILABLE_MONTHS.map(m => (
              <button key={m.key} onClick={() => setSelectedMonth(m)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedMonth.key === m.key
                    ? 'bg-[#C4B5FD] text-white shadow-sm'
                    : 'border border-[#E9D5FF] bg-white text-[#78716C] hover:border-[#C4B5FD]'
                }`}
              >
                {MONTHS[m.month - 1].slice(0, 3)} {m.year}
              </button>
            ))}
          </div>
        )}

        {/* Custom range */}
        {periodMode === 'custom' && (
          <div className="mb-5 flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-[#78716C]">From</label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                className="w-full rounded-2xl border border-[#E9D5FF] bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20" />
            </div>
            <span className="mt-5 text-[#78716C]">→</span>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-[#78716C]">To</label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                className="w-full rounded-2xl border border-[#E9D5FF] bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20" />
            </div>
          </div>
        )}

        <button onClick={onClose} className="w-full rounded-2xl bg-[#C4B5FD] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#a78bfa] active:scale-[0.98]">
          Done
        </button>
      </div>
    </>
  )
}

// ── Active filter pill ────────────────────────────────────────────────────────
function ActivePill({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-medium text-[#7C3AED]">
      {label}
      <button onClick={onRemove} className="ml-0.5 text-[#C4B5FD] hover:text-[#7C3AED]">
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

// ── Sheet option chip ─────────────────────────────────────────────────────────
function SheetChip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
        active ? 'bg-[#C4B5FD] text-white shadow-sm' : 'border border-[#E9D5FF] bg-white text-[#78716C] hover:border-[#C4B5FD] hover:text-[#1C1917]'
      }`}
    >{label}</button>
  )
}

// ── Filter sheet ──────────────────────────────────────────────────────────────
function FilterSheet({ open, onClose, typeFilter, catFilter, payFilter, expenseCategories, incomeCategories, onType, onCat, onPay, onClear }) {
  if (!open) return null
  const visibleCategories = (typeFilter === 'Income' ? incomeCategories : expenseCategories).map(c => c.label)
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl">
        <div className="mb-5 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-[#E9D5FF]" />
        </div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1C1917]">Filters</h3>
          <button onClick={() => { onClear(); onClose() }} className="text-xs font-medium text-[#C4B5FD] hover:underline">Clear all</button>
        </div>

        <div className="mb-5">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">Type</p>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => <SheetChip key={t} label={t} active={typeFilter === t} onClick={() => onType(t)} />)}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">Category</p>
          <div className="flex flex-wrap gap-2">
            <SheetChip label="All" active={!catFilter} onClick={() => onCat(null)} />
            {visibleCategories.map(c => <SheetChip key={c} label={c} active={catFilter === c} onClick={() => onCat(catFilter === c ? null : c)} />)}
          </div>
        </div>

        {typeFilter !== 'Income' && (
          <div className="mb-6">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">Payment method</p>
            <div className="flex flex-wrap gap-2">
              <SheetChip label="All" active={!payFilter} onClick={() => onPay(null)} />
              {PAYMENTS.map(p => <SheetChip key={p} label={p} active={payFilter === p} onClick={() => onPay(payFilter === p ? null : p)} />)}
            </div>
          </div>
        )}

        <button onClick={onClose} className="w-full rounded-2xl bg-[#C4B5FD] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#a78bfa] active:scale-[0.98]">
          Show results
        </button>
      </div>
    </>
  )
}
