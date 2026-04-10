import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#FAF8FF]">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
