import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-litl-muted mb-4">You do not have administrator permissions.</p>
          <Link href="/dashboard" className="text-litl-blue hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-litl-ink mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Study Centre Card */}
        <Link href="/admin/subjects" className="block group">
          <div className="rounded-litl bg-white p-6 shadow-sm border border-slate-200 group-hover:border-litl-blue transition-colors h-full">
            <h2 className="font-semibold text-lg text-litl-ink mb-2">Study Centre</h2>
            <p className="text-sm text-slate-500 mb-4">Manage subjects, topics, and notes.</p>
            <span className="text-sm text-litl-blue font-semibold">Manage Content &rarr;</span>
          </div>
        </Link>

        {/* CBT Centre Card */}
        <Link href="/admin/questions" className="block group">
          <div className="rounded-litl bg-white p-6 shadow-sm border border-slate-200 group-hover:border-litl-blue transition-colors h-full">
            <h2 className="font-semibold text-lg text-litl-ink mb-2">CBT Centre</h2>
            <p className="text-sm text-slate-500 mb-4">Manage exam questions.</p>
            <span className="text-sm text-litl-blue font-semibold">Manage Questions &rarr;</span>
          </div>
        </Link>

        {/* Future Features Card */}
        <div className="rounded-litl bg-white p-6 shadow-sm border border-slate-200 opacity-50 h-full">
          <h2 className="font-semibold text-lg text-litl-ink mb-2">Users & Analytics</h2>
          <p className="text-sm text-slate-500 mb-4">Manage users and view platform data.</p>
          <span className="text-sm text-slate-400 font-semibold">Coming Later</span>
        </div>
      </div>
    </div>
  )
}