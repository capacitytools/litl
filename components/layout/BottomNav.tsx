'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Learn', href: '/study', icon: '📚' },
    { name: 'CBT', href: '/cbt', icon: '✍️' },
    { name: 'AI Tutor', href: '/ai', icon: '🤖' },
    { name: 'My LITL', href: '/dashboard', icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white pb-safe sm:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-litl-blue' : 'text-litl-muted hover:text-litl-blue'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}