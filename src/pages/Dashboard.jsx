import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'

// ── Dummy data per period ─────────────────────────────────────────────────────
const PERIOD_DATA = {
  Daily:   { expenses: 94,   income: 0,     priorExpenses: 112,  label: 'Today',        priorLabel: 'yesterday'  },
  Weekly:  { expenses: 387,  income: 500,   priorExpenses: 310,  label: 'This week',    priorLabel: 'last week'  },
  Monthly: { expenses: 1122, income: 4200,  priorExpenses: 888,  label: 'April 2026',   priorLabel: 'last month' },
  Yearly:  { expenses: 8740, income: 52000, priorExpenses: 7200, label: 'This year',    priorLabel: 'last year'  },
}

const CATEGORY_DATA = [
  { name: 'Food & Dining',    emoji: '🍜', value: 386, fill: '#C4B5FD' },
  { name: 'Shopping',         emoji: '🛍️', value: 312, fill: '#F9A8D4' },
  { name: 'Bills & Utilities',emoji: '💡', value: 180, fill: '#6EE7B7' },
  { name: 'Transportation',   emoji: '🚗', value: 124, fill: '#FCD34D' },
  { name: 'Health & Fitness', emoji: '💊', value: 75,  fill: '#93C5FD' },
  { name: 'Entertainment',    emoji: '🎬', value: 45,  fill: '#FCA5A5' },
]

const PAYMENT_SPLIT = [
  { label: 'Chase Sapphire',   type: 'card',  amount: 542, color: '#C4B5FD' },
  { label: 'Amex Gold',        type: 'card',  amount: 298, color: '#F9A8D4' },
  { label: 'Debit',            type: 'debit', amount: 186, color: '#93C5FD' },
  { label: 'Cash',             type: 'cash',  amount: 96,  color: '#6EE7B7' },
]

const RECENT = [
  { id: 1, emoji: '🍜', name: 'Sushi dinner',   category: 'Food & Dining',    date: 'Apr 8', amount: 42.50  },
  { id: 2, emoji: '🚗', name: 'Uber',            category: 'Transportation',   date: 'Apr 7', amount: 28.00  },
  { id: 3, emoji: '🛍️', name: 'Amazon order',   category: 'Shopping',         date: 'Apr 6', amount: 156.99 },
  { id: 4, emoji: '💊', name: 'Pharmacy',        category: 'Health & Fitness', date: 'Apr 5', amount: 35.00  },
  { id: 5, emoji: '🎬', name: 'Netflix',         category: 'Entertainment',    date: 'Apr 4', amount: 15.99  },
]

const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Yearly']

// ── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="rounded-xl border border-[#E9D5FF] bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-[#1C1917]">{name}</p>
      <p className="text-[#C4B5FD]">${value}</p>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('Monthly')

  const { expenses, income, priorExpenses, label, priorLabel } = PERIOD_DATA[period]
  const net      = income - expenses
  const delta    = expenses - priorExpenses
  const deltaPct = Math.round(Math.abs(delta / priorExpenses) * 100)
  const isOver   = delta > 0
  const netPositive = net >= 0

  const payTotal = PAYMENT_SPLIT.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="flex flex-col gap-5 px-5 pt-10 pb-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">Mochi</h1>
        <button
          onClick={() => navigate('/quick-add')}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C4B5FD] shadow-sm shadow-[#C4B5FD]/40 transition-transform active:scale-95"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* ── Period tabs ── */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl border border-[#E9D5FF] bg-white p-1">
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-xl py-2 text-[11px] font-semibold transition-all ${
              period === p
                ? 'bg-[#C4B5FD] text-white shadow-sm'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── Stat card ── */}
      <div className="rounded-3xl bg-[#C4B5FD] p-5 shadow-sm shadow-[#C4B5FD]/30">
        <p className="mb-3 text-xs font-medium text-white/70">{label}</p>

        {/* Income / Expenses / Net row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Income</span>
            <span className="text-lg font-bold tabular-nums text-white leading-tight">
              ${income.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Expenses</span>
            <span className="text-lg font-bold tabular-nums text-white leading-tight">
              ${expenses.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Net</span>
            <span className={`text-lg font-bold tabular-nums leading-tight ${netPositive ? 'text-[#BBF7D0]' : 'text-[#FECDD3]'}`}>
              {netPositive ? '+' : '-'}${Math.abs(net).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-3 h-px bg-white/20" />

        {/* Expense delta vs prior period */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
            {isOver ? '↑' : '↓'} {deltaPct}%
          </span>
          <span className="text-xs text-white/70">
            spending {isOver ? 'up' : 'down'} vs {priorLabel} (${priorExpenses.toLocaleString()})
          </span>
        </div>
      </div>

      {/* ── Donut chart card ── */}
      <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[#1C1917]">Breakdown by category</h2>
        <div className="relative flex justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                strokeWidth={2}
                stroke="#FAF8FF"
                paddingAngle={2}
              />
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#1C1917]">${expenses.toLocaleString()}</span>
            <span className="text-[10px] text-[#78716C]">total</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {CATEGORY_DATA.map(({ name, emoji, value, fill }) => (
            <div key={name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: fill }} />
              <span className="truncate text-xs text-[#78716C]">{emoji} {name}</span>
              <span className="ml-auto text-xs font-medium tabular-nums text-[#1C1917]">${value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment method split ── */}
      <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[#1C1917]">Payment methods</h2>

        {/* Stacked bar */}
        <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full">
          {PAYMENT_SPLIT.map(({ label, amount, color }) => (
            <div
              key={label}
              style={{ width: `${(amount / payTotal) * 100}%`, background: color }}
              className="transition-all"
            />
          ))}
        </div>

        {/* Legend rows */}
        <div className="flex flex-col gap-2.5">
          {PAYMENT_SPLIT.map(({ label, amount, color }) => {
            const pct = Math.round((amount / payTotal) * 100)
            return (
              <div key={label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
                <span className="flex-1 text-xs text-[#78716C]">{label}</span>
                <span className="text-xs text-[#78716C]">{pct}%</span>
                <span className="w-16 text-right text-xs font-medium tabular-nums text-[#1C1917]">${amount}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Recent transactions ── */}
      <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1C1917]">Recent transactions</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-xs font-medium text-[#C4B5FD] hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="flex flex-col divide-y divide-[#F3E8FF]">
          {RECENT.map(({ id, emoji, name, category, date, amount }) => (
            <div key={id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-base">
                  {emoji}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">{name}</p>
                  <p className="text-xs text-[#78716C]">{category} · {date}</p>
                </div>
              </div>
              <span className="text-sm font-semibold tabular-nums text-[#1C1917]">
                -${amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
