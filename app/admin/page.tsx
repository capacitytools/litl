import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic' // <--- This forces the server to fetch fresh data every time

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile directly from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-litl-muted mb-4">You do not have administrator permissions.</p>
          <div className="bg-slate-100 p-4 rounded text-sm text-left font-mono mb-6">
            <p className="font-bold text-black mb-2">Debug Data:</p>
            <p>Your ID: {user.id}</p>
            <p>Your Email: {user.email}</p>
            <p>Role in DB: <span className="text-red-600">{profile?.role || 'NULL'}</span></p>
          </div>
          <Link href="/dashboard" className="text-litl-blue hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-litl-ink mb-8">Admin Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/subjects" className="block group">
          <div className="rounded-litl bg-white p-6 shadow-sm border border-slate-200 group-hover:border-litl-blue transition-colors">
            <h2 className="font-semibold text-lg text-litl-ink mb-2">Study Centre</h2>
            <p className="text-sm text-slate-500 mb-4">Manage subjects, topics, and notes.</p>
            <span className="text-sm text-litl-blue font-semibold">Manage Content &rarr;</span>
          </div>
        </Link>
      </div>
    </div>
  )
}