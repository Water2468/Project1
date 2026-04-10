import { useState } from 'react'
import { useCategories } from '../lib/categoriesContext'

// ── Constants ─────────────────────────────────────────────────────────────────
const NETWORKS = ['Visa', 'Mastercard', 'Amex', 'Other']

const NETWORK_STYLE = {
  Visa:       { bg: '#EFF6FF', text: '#1D4ED8', badge: 'VISA' },
  Mastercard: { bg: '#FFF7ED', text: '#C2410C', badge: 'MC'   },
  Amex:       { bg: '#ECFDF5', text: '#047857', badge: 'AMEX' },
  Other:      { bg: '#F5F5F4', text: '#78716C', badge: 'CARD' },
}

const INITIAL_CARDS = [
  { id: '1', name: 'Chase Sapphire',   last4: '4242', network: 'Visa'       },
  { id: '2', name: 'Amex Gold',        last4: '3456', network: 'Amex'       },
  { id: '3', name: 'Citi Double Cash', last4: '',     network: 'Mastercard' },
]

const EMPTY_FORM = { name: '', last4: '', network: 'Visa' }

// ── Small reusable pieces ─────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-[#C4B5FD]">
      {title}
    </p>
  )
}

function SettingsRow({ label, value, icon, last }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3.5 ${!last ? 'border-b border-[#F3E8FF]' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-base">{icon}</span>
        <span className="text-sm text-[#1C1917]">{label}</span>
      </div>
      <span className="text-sm text-[#78716C]">{value}</span>
    </div>
  )
}

function NetworkBadge({ network }) {
  const { bg, text, badge } = NETWORK_STYLE[network] ?? NETWORK_STYLE.Other
  return (
    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide" style={{ background: bg, color: text }}>
      {badge}
    </span>
  )
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────
function CardFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM)
  const isValid = form.name.trim().length > 0

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-[430px] rounded-t-3xl bg-white p-6 pb-10 shadow-xl">

        {/* Handle */}
        <div className="mb-5 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-[#E9D5FF]" />
        </div>

        <h2 className="mb-5 text-base font-semibold text-[#1C1917]">
          {initial ? 'Edit card' : 'Add a card'}
        </h2>

        {/* Card name */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Card nickname</label>
          <input
            autoFocus
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Chase Sapphire"
            className="w-full rounded-2xl border border-[#E9D5FF] bg-[#FAF8FF] px-4 py-3 text-sm text-[#1C1917] outline-none placeholder-[#C4B5FD]/50 focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
          />
        </div>

        {/* Last 4 digits */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Last 4 digits <span className="text-[#C4B5FD]/60">(optional)</span></label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={form.last4}
            onChange={e => set('last4', e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="0000"
            className="w-full rounded-2xl border border-[#E9D5FF] bg-[#FAF8FF] px-4 py-3 text-sm text-[#1C1917] outline-none placeholder-[#C4B5FD]/50 focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
          />
        </div>

        {/* Network selector */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Network</label>
          <div className="flex rounded-2xl border border-[#E9D5FF] bg-[#FAF8FF] p-1">
            {NETWORKS.map(n => (
              <button
                key={n}
                onClick={() => set('network', n)}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                  form.network === n
                    ? 'bg-[#C4B5FD] text-white shadow-sm'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[#E9D5FF] py-3.5 text-sm font-semibold text-[#78716C] transition-colors hover:bg-[#FAF8FF]"
          >
            Cancel
          </button>
          <button
            onClick={() => isValid && onSave(form)}
            disabled={!isValid}
            className="flex-1 rounded-2xl bg-[#C4B5FD] py-3.5 text-sm font-semibold text-[#1C1917] transition-all hover:bg-[#a78bfa] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {initial ? 'Save changes' : 'Add card'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const EMOJIS = ['🍜','🛍️','🚗','🎬','💊','💡','✈️','📦','🏠','🐾','🎓','💼','💻','📈','🎁','↩️','💰','🍔','☕','🏋️','💈','🎮','🌿','🛺']

function CategoryManager({ categories, onAdd, onRemove, placeholder }) {
  const [input, setInput]     = useState('')
  const [emoji, setEmoji]     = useState('📦')
  const [picking, setPicking] = useState(false)

  function handleAdd() {
    const label = input.trim()
    if (!label || categories.some(c => c.label === label)) return
    onAdd({ label, emoji })
    setInput('')
    setEmoji('📦')
  }

  return (
    <div>
      {/* Existing categories */}
      <div className="rounded-3xl border border-[#E9D5FF] bg-white overflow-hidden mb-3">
        {categories.length === 0 && (
          <p className="px-4 py-4 text-sm text-[#78716C] text-center">No categories yet</p>
        )}
        {categories.map((cat, i) => (
          <div key={cat.label} className={`flex items-center gap-3 px-4 py-3 ${i < categories.length - 1 ? 'border-b border-[#F3E8FF]' : ''}`}>
            <span className="text-xl">{cat.emoji}</span>
            <span className="flex-1 text-sm text-[#1C1917]">{cat.label}</span>
            <button
              onClick={() => onRemove(cat.label)}
              className="flex h-7 w-7 items-center justify-center rounded-xl text-[#78716C] transition-colors hover:bg-[#FFF1F2] hover:text-[#E11D48]"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add row */}
      <div className="flex gap-2 items-center">
        {/* Emoji picker trigger */}
        <div className="relative">
          <button
            onClick={() => setPicking(p => !p)}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-[#E9D5FF] bg-white text-xl transition-colors hover:border-[#C4B5FD]"
          >
            {emoji}
          </button>
          {picking && (
            <div className="absolute bottom-full left-0 mb-2 z-30 w-56 rounded-2xl border border-[#E9D5FF] bg-white p-3 shadow-xl grid grid-cols-6 gap-1">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => { setEmoji(e); setPicking(false) }}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-lg transition-colors hover:bg-[#F3E8FF] ${emoji === e ? 'bg-[#F3E8FF]' : ''}`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="flex-1 rounded-2xl border border-[#E9D5FF] bg-white px-4 py-3 text-sm text-[#1C1917] placeholder-[#C4B5FD]/50 outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/20"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-[#C4B5FD] text-white shadow-sm transition-all hover:bg-[#a78bfa] disabled:opacity-40"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const { expenseCategories, incomeCategories, addExpense, removeExpense, addIncome, removeIncome } = useCategories()
  const [cards, setCards]           = useState(INITIAL_CARDS)
  const [modal, setModal]           = useState(null) // null | 'add' | Card (editing)
  const [confirmDelete, setConfirm] = useState(null) // card id pending delete

  function handleSave(form) {
    if (modal === 'add') {
      setCards(prev => [...prev, { ...form, id: Date.now().toString() }])
    } else {
      setCards(prev => prev.map(c => c.id === modal.id ? { ...modal, ...form } : c))
    }
    setModal(null)
  }

  function handleDelete(id) {
    if (confirmDelete === id) {
      setCards(prev => prev.filter(c => c.id !== id))
      setConfirm(null)
    } else {
      setConfirm(id)
    }
  }

  return (
    <>
    <div className="flex flex-col px-5 pt-10 pb-6 gap-6">

      <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">Settings</h1>

      {/* ── Credit cards ── */}
      <div>
        <SectionHeader title="Credit Cards" />
        <div className="rounded-3xl border border-[#E9D5FF] bg-white overflow-hidden">

          {cards.length === 0 && (
            <div className="flex flex-col items-center gap-1 py-8 text-center">
              <span className="text-3xl">💳</span>
              <p className="text-sm text-[#78716C]">No cards yet</p>
            </div>
          )}

          {cards.map((card, i) => {
            const isConfirming = confirmDelete === card.id
            return (
              <div
                key={card.id}
                className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${
                  isConfirming ? 'bg-[#FFF1F2]' : ''
                } ${i < cards.length - 1 ? 'border-b border-[#F3E8FF]' : ''}`}
              >
                {/* Card info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-lg">
                    💳
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-[#1C1917]">{card.name}</span>
                      <NetworkBadge network={card.network} />
                    </div>
                    <span className="text-xs text-[#78716C]">
                      {card.last4 ? `···· ${card.last4}` : 'No digits saved'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {isConfirming ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-[#E11D48]">Delete?</span>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="rounded-xl bg-[#FECDD3] px-3 py-1.5 text-xs font-semibold text-[#E11D48] transition-colors hover:bg-[#FDA4AF]"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirm(null)}
                      className="rounded-xl border border-[#E9D5FF] px-3 py-1.5 text-xs font-semibold text-[#78716C] transition-colors hover:bg-[#FAF8FF]"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setConfirm(null); setModal(card) }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[#78716C] transition-colors hover:bg-[#F3E8FF] hover:text-[#C4B5FD]"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[#78716C] transition-colors hover:bg-[#FFF1F2] hover:text-[#E11D48]"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add card row */}
          <button
            onClick={() => { setConfirm(null); setModal('add') }}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-[#C4B5FD] transition-colors hover:bg-[#FAF8FF] ${cards.length > 0 ? 'border-t border-[#F3E8FF]' : ''}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-dashed border-[#E9D5FF]">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Add a card
          </button>
        </div>
      </div>

      {/* ── Expense categories ── */}
      <div>
        <SectionHeader title="Expense Categories" />
        <CategoryManager
          categories={expenseCategories}
          onAdd={addExpense}
          onRemove={removeExpense}
          placeholder="New category name…"
        />
      </div>

      {/* ── Income categories ── */}
      <div>
        <SectionHeader title="Income Categories" />
        <CategoryManager
          categories={incomeCategories}
          onAdd={addIncome}
          onRemove={removeIncome}
          placeholder="New category name…"
        />
      </div>

      {/* ── Preferences ── */}
      <div>
        <SectionHeader title="Preferences" />
        <div className="rounded-3xl border border-[#E9D5FF] bg-white overflow-hidden">
          <SettingsRow icon="💰" label="Currency"       value="USD"    />
          <SettingsRow icon="📅" label="Start of week"  value="Monday" />
          <SettingsRow icon="🗓️" label="Start of month" value="1st"    last />
        </div>
      </div>

      {/* ── Appearance ── */}
      <div>
        <SectionHeader title="Appearance" />
        <div className="rounded-3xl border border-[#E9D5FF] bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="text-base">🌙</span>
              <span className="text-sm text-[#1C1917]">Dark mode</span>
            </div>
            {/* Visual-only toggle */}
            <div className="h-6 w-11 rounded-full bg-[#E9D5FF] relative cursor-not-allowed opacity-60">
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Data ── */}
      <div>
        <SectionHeader title="Data" />
        <div className="rounded-3xl border border-[#E9D5FF] bg-white overflow-hidden">
          <SettingsRow icon="📤" label="Export to CSV"        value="→" />
          <SettingsRow icon="🔔" label="Daily spend summary"  value="Off" last />
        </div>
      </div>

      {/* ── About ── */}
      <div>
        <SectionHeader title="About" />
        <div className="rounded-3xl border border-[#E9D5FF] bg-white overflow-hidden">
          <SettingsRow icon="🍡" label="Mochi"   value="v0.1.0" last />
        </div>
      </div>

    </div>

      {/* ── Modal ── */}
      {modal && (
        <CardFormModal
          initial={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
