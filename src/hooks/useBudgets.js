import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBudgets() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBudgets()
  }, [])

  async function fetchBudgets() {
    setLoading(true)
    const { data, error } = await supabase.from('budgets').select('*')

    if (error) setError(error.message)
    else setBudgets(data)
    setLoading(false)
  }

  async function upsertBudget(budget) {
    const { data, error } = await supabase
      .from('budgets')
      .upsert([budget])
      .select()
      .single()

    if (error) throw error
    setBudgets((prev) => {
      const exists = prev.find((b) => b.id === data.id)
      return exists ? prev.map((b) => (b.id === data.id ? data : b)) : [data, ...prev]
    })
    return data
  }

  return { budgets, loading, error, upsertBudget, refetch: fetchBudgets }
}
