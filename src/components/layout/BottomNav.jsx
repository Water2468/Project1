import { NavLink, useNavigate } from 'react-router-dom'

function HomeIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h.01M11 15h2M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

const navItems = [
  { to: '/', label: 'Home', icon: <HomeIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <ListIcon /> },
  { to: '/budgets', label: 'Budgets', icon: <WalletIcon /> },
  { to: '/settings', label: 'Settings', icon: <GearIcon /> },
]

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-[#E9D5FF] bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 2).map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-[#C4B5FD]' : 'text-[#78716C] hover:text-[#1C1917]'
              }`
            }
          >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}

        {/* Centre add button */}
        <button
          onClick={() => navigate('/quick-add')}
          className="flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-[#C4B5FD] shadow-lg shadow-[#C4B5FD]/40 transition-transform active:scale-95"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {navItems.slice(2).map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-[#C4B5FD]' : 'text-[#78716C] hover:text-[#1C1917]'
              }`
            }
          >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
