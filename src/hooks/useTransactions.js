import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (error) setError(error.message)
    else setTransactions(data)
    setLoading(false)
  }

  async function addTransaction(transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()

    if (error) throw error
    setTransactions((prev) => [data, ...prev])
    return data
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return { transactions, loading, error, addTransaction, deleteTransaction, refetch: fetchTransactions }
}
