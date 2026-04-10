export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-[#E9D5FF] bg-white p-6 ${className}`}>
      {children}
    </div>
  )
}
