import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Settings from './pages/Settings'
import QuickAdd from './pages/QuickAdd'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/quick-add" element={<QuickAdd />} />
      </Routes>
    </BrowserRouter>
  )
}
