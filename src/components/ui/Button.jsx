export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const base = 'rounded-xl px-4 py-2 text-sm font-medium transition-colors'
  const variants = {
    primary: 'bg-[#C4B5FD] text-[#1C1917] hover:bg-[#a78bfa]',
    ghost: 'bg-transparent text-[#1C1917] hover:bg-[#F3E8FF]',
  }

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
