export default function Input({ label, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-[#1C1917]">{label}</label>}
      <input
        className={`rounded-xl border border-[#E9D5FF] bg-white px-4 py-2 text-sm text-[#1C1917] outline-none focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#C4B5FD]/30 ${className}`}
        {...props}
      />
    </div>
  )
}
