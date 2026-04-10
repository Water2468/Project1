import { createContext, useContext, useState } from 'react'

const DEFAULT_EXPENSE = [
  { label: 'Food & Dining',     emoji: '🍜' },
  { label: 'Shopping',          emoji: '🛍️' },
  { label: 'Transportation',    emoji: '🚗' },
  { label: 'Entertainment',     emoji: '🎬' },
  { label: 'Health & Fitness',  emoji: '💊' },
  { label: 'Bills & Utilities', emoji: '💡' },
  { label: 'Travel',            emoji: '✈️' },
  { label: 'Other',             emoji: '📦' },
]

const DEFAULT_INCOME = [
  { label: 'Salary',     emoji: '💼' },
  { label: 'Freelance',  emoji: '💻' },
  { label: 'Investment', emoji: '📈' },
  { label: 'Gift',       emoji: '🎁' },
  { label: 'Refund',     emoji: '↩️' },
  { label: 'Other',      emoji: '💰' },
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const CategoriesContext = createContext(null)

export function CategoriesProvider({ children }) {
  const [expenseCategories, setExpenseCategories] = useState(() =>
    load('mochi_expense_cats', DEFAULT_EXPENSE)
  )
  const [incomeCategories, setIncomeCategories] = useState(() =>
    load('mochi_income_cats', DEFAULT_INCOME)
  )

  function addExpense(cat) {
    const next = [...expenseCategories, cat]
    setExpenseCategories(next)
    save('mochi_expense_cats', next)
  }

  function removeExpense(label) {
    const next = expenseCategories.filter(c => c.label !== label)
    setExpenseCategories(next)
    save('mochi_expense_cats', next)
  }

  function addIncome(cat) {
    const next = [...incomeCategories, cat]
    setIncomeCategories(next)
    save('mochi_income_cats', next)
  }

  function removeIncome(label) {
    const next = incomeCategories.filter(c => c.label !== label)
    setIncomeCategories(next)
    save('mochi_income_cats', next)
  }

  return (
    <CategoriesContext.Provider value={{
      expenseCategories,
      incomeCategories,
      addExpense,
      removeExpense,
      addIncome,
      removeIncome,
    }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  return useContext(CategoriesContext)
}
