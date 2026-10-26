import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-litl transition-colors focus:outline-none focus:ring-2 focus:ring-litl-blue focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-litl-blue text-white hover:bg-litl-blue-dark",
    secondary: "bg-litl-gold text-white hover:bg-litl-gold-dark",
    outline: "border border-litl-blue text-litl-blue hover:bg-litl-blue/5",
    ghost: "text-litl-muted hover:text-litl-blue hover:bg-slate-100",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}