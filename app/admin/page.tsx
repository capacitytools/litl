import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'admin') return <div className="p-8 text-center text-red-600 font-bold">Access Denied</div>

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

        <div className="rounded-litl bg-white p-6 shadow-sm border border-slate-200 opacity-50">
          <h2 className="font-semibold text-lg text-litl-ink mb-2">CBT Centre</h2>
          <p className="text-sm text-slate-500 mb-4">Manage questions and exams.</p>
          <span className="text-sm text-slate-400 font-semibold">Coming in Phase 4</span>
        </div>
      </div>
    </div>
  )
}