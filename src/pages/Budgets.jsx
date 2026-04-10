import { useState, useMemo } from 'react'
import { useCategories } from '../lib/categoriesContext'
import { TRANSACTIONS } from './Transactions'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function loadBudgets() {
  try { return JSON.parse(localStorage.getItem('mochi_budgets') || '{}') } catch { return {} }
}
function saveBudgets(b) {
  localStorage.setItem('mochi_budgets', JSON.stringify(b))
}

function getAvailableMonths() {
  const seen = new Set()
  const result = []
  TRANSACTIONS.forEach(tx => {
    const [y, m] = tx.date.split('-').map(Number)
    const key = `${y}-${String(m).padStart(2, '0')}`
    if (!seen.has(key)) { seen.add(key); result.push({ year: y, month: m, key }) }
  })
  const now = new Date()
  const curKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
  if (!seen.has(curKey)) result.push({ year: now.getFullYear(), month: now.getMonth()+1, key: curKey })
  return result.sort((a, b) => b.key.localeCompare(a.key))
}

// ── Budget input modal ────────────────────────────────────────────────────────
function BudgetModal({ category, current, onSave, onClose }) {
  const [val, setVal] = useState(current > 0 ? String(current) : '')

  function handleSave() {
    const n = parseFloat(val)
    if (!isNaN(n) && n >= 0) { onSave(n); onClose() }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl">
        <div className="mb-5 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-[#E9D5FF]" />
        </div>
        <h3 className="mb-1 text-base font-bold text-[#1C1917]">Set budget</h3>
        <p className="mb-5 text-sm text-[#78716C]">{category.emoji} {category.label}</p>

        <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Monthly limit</label>
        <div className="relative mb-6">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-light text-[#C4B5FD]">$</span>
          <input
            autoFocus
            type="number"
            inputMode="decimal"
            min="0"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="0"
            className="w-full rounded-2xl border border-[#E9D5FF] bg-[#FAF8FF] py-3.5 pl-9 pr-4 text-xl font-semibold text-[#1C1917] outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl border border-[#E9D5FF] py-3.5 text-sm font-semibold text-[#78716C] transition-colors hover:bg-[#FAF8FF]">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!val || isNaN(parseFloat(val))}
            className="flex-1 rounded-2xl bg-[#C4B5FD] py-3.5 text-sm font-semibold text-[#1C1917] transition-all hover:bg-[#a78bfa] disabled:opacity-40">
            Save
          </button>
        </div>
      </div>
    </>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function BudgetBar({ spent, budget }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const over = spent > budget && budget > 0
  const warn = pct >= 80 && !over

  const barColor  = over ? '#FECDD3' : warn ? '#FCD34D' : '#C4B5FD'
  const textColor = over ? '#E11D48' : warn ? '#92400E' : '#7C3AED'

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex justify-between text-xs">
        <span style={{ color: textColor }} className="font-semibold">
          ${spent.toFixed(0)}{' '}
          <span className="font-normal text-[#78716C]">of ${budget.toFixed(0)}</span>
        </span>
        <span style={{ color: textColor }} className="font-semibold">
          {over ? `$${(spent - budget).toFixed(0)} over` : `$${(budget - spent).toFixed(0)} left`}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Budgets() {
  const { expenseCategories } = useCategories()
  const AVAILABLE_MONTHS = getAvailableMonths()

  const [selectedMonth, setSelectedMonth] = useState(AVAILABLE_MONTHS[0])
  const [budgets, setBudgets]             = useState(loadBudgets)
  const [editing, setEditing]             = useState(null)
  const [monthOpen, setMonthOpen]         = useState(false)

  function handleSave(label, amount) {
    const next = { ...budgets, [label]: amount }
    setBudgets(next)
    saveBudgets(next)
  }

  const spending = useMemo(() => {
    const map = {}
    TRANSACTIONS.forEach(tx => {
      if (tx.type !== 'expense') return
      const [y, m] = tx.date.split('-').map(Number)
      if (y !== selectedMonth.year || m !== selectedMonth.month) return
      map[tx.category] = (map[tx.category] || 0) + tx.amount
    })
    return map
  }, [selectedMonth])

  const monthLabel   = `${MONTHS[selectedMonth.month - 1]} ${selectedMonth.year}`
  const totalBudget  = expenseCategories.reduce((s, c) => s + (budgets[c.label] || 0), 0)
  const totalSpent   = expenseCategories.reduce((s, c) => s + (spending[c.label] || 0), 0)
  const budgetedCats = expenseCategories.filter(c => budgets[c.label] > 0).length

  return (
    <div className="flex flex-col px-5 pt-10 pb-6">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-[#1C1917]">Budgets</h1>

      {/* Month selector */}
      <button
        onClick={() => setMonthOpen(true)}
        className="mb-4 flex w-full items-center justify-between rounded-2xl border border-[#E9D5FF] bg-white px-4 py-3 text-sm transition-colors hover:border-[#C4B5FD]"
      >
        <div className="flex items-center gap-2 font-medium text-[#1C1917]">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-[#C4B5FD]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {monthLabel}
        </div>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C4B5FD" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Overall summary card */}
      {budgetedCats > 0 && (
        <div className="mb-4 rounded-3xl bg-[#C4B5FD] p-5 shadow-sm shadow-[#C4B5FD]/30">
          <p className="mb-3 text-xs font-medium text-white/70">
            {monthLabel} · {budgetedCats} categor{budgetedCats === 1 ? 'y' : 'ies'} budgeted
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">Budget</span>
              <span className="text-lg font-bold tabular-nums text-white leading-tight">${totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">Spent</span>
              <span className="text-lg font-bold tabular-nums text-white leading-tight">${totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">Left</span>
              <span className={`text-lg font-bold tabular-nums leading-tight ${totalSpent <= totalBudget ? 'text-[#BBF7D0]' : 'text-[#FECDD3]'}`}>
                {totalSpent <= totalBudget ? '+' : '-'}${Math.abs(totalBudget - totalSpent).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white/80 transition-all duration-500"
              style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty state nudge */}
      {budgetedCats === 0 && (
        <div className="mb-4 rounded-3xl border border-dashed border-[#E9D5FF] p-5 text-center">
          <p className="mb-1 text-sm font-medium text-[#1C1917]">No budgets set yet</p>
          <p className="text-xs text-[#78716C]">Tap any category below to set a monthly limit</p>
        </div>
      )}

      {/* Per-category cards */}
      <div className="flex flex-col gap-3">
        {expenseCategories.map(cat => {
          const budget    = budgets[cat.label] || 0
          const spent     = spending[cat.label] || 0
          const hasBudget = budget > 0

          return (
            <div key={cat.label} className="rounded-3xl border border-[#E9D5FF] bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3E8FF] text-lg">
                    {cat.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">{cat.label}</p>
                    {!hasBudget && spent > 0 && (
                      <p className="text-xs text-[#78716C]">Spent ${spent.toFixed(0)} · no limit</p>
                    )}
                    {!hasBudget && spent === 0 && (
                      <p className="text-xs text-[#C4B5FD]">Tap to set a budget</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditing(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                    hasBudget
                      ? 'border border-[#E9D5FF] text-[#78716C] hover:border-[#C4B5FD] hover:text-[#1C1917]'
                      : 'bg-[#F3E8FF] text-[#7C3AED] hover:bg-[#E9D5FF]'
                  }`}
                >
                  {hasBudget ? 'Edit' : '+ Set'}
                </button>
              </div>

              {hasBudget && <BudgetBar spent={spent} budget={budget} />}
              {!hasBudget && spent > 0 && (
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
                  <div className="h-full w-full rounded-full bg-[#E9D5FF]" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Month picker sheet */}
      {monthOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMonthOpen(false)} />
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl">
            <div className="mb-5 flex justify-center">
              <div className="h-1.5 w-10 rounded-full bg-[#E9D5FF]" />
            </div>
            <h3 className="mb-5 text-base font-bold text-[#1C1917]">Select month</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_MONTHS.map(m => (
                <button key={m.key} onClick={() => { setSelectedMonth(m); setMonthOpen(false) }}
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
          </div>
        </>
      )}

      {/* Budget edit modal */}
      {editing && (
        <BudgetModal
          category={editing}
          current={budgets[editing.label] || 0}
          onSave={amount => handleSave(editing.label, amount)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
