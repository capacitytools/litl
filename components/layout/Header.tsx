'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Header({ user }: { user: any }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-litl bg-litl-blue text-white font-bold">L</span>
            <span className="font-display text-lg font-semibold text-litl-blue hidden sm:block">LITL</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/admin" className="text-sm font-medium text-litl-muted hover:text-litl-blue hidden sm:block">Admin</Link>
                <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-litl-blue">Sign In</Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-litl-ink sm:hidden">☰</button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white sm:hidden pt-20 px-6">
          <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-2xl">✕</button>
          <nav className="flex flex-col space-y-6 text-lg font-medium text-litl-ink">
            <Link href="/study" onClick={() => setMenuOpen(false)}>Study Centre</Link>
            <Link href="/cbt" onClick={() => setMenuOpen(false)}>CBT Centre</Link>
            <Link href="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link>
            <Link href="/ai" onClick={() => setMenuOpen(false)}>AI Learning</Link>
            <hr className="border-slate-100" />
            <Link href="/about" onClick={() => setMenuOpen(false)}>About LITL</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            {user && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-litl-blue">Admin Dashboard</Link>
            )}
          </nav>
        </div>
      )}
    </>
  )
}