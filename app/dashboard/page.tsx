import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-litl-ink">
          Welcome, {profile?.full_name || 'Learner'}!
        </h1>
        <p className="text-litl-muted mt-2">This is your personal LITL dashboard.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-lg mb-2">Account Details</h2>
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Role:</strong> {profile?.role === 'admin' ? 'Administrator' : 'Student'}</p>
            <p><strong>Joined:</strong> {new Date(profile?.created_at).toLocaleDateString()}</p>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-lg mb-2">Quick Links</h2>
          <div className="flex flex-col gap-3 mt-4">
             <Link href="/study" className="text-litl-blue hover:underline">Go to Study Centre &rarr;</Link>
             <Link href="/cbt" className="text-litl-blue hover:underline">Go to CBT Centre &rarr;</Link>
             {profile?.role === 'admin' && (
               <Link href="/admin" className="text-litl-wine font-semibold hover:underline">Manage App (Admin) &rarr;</Link>
             )}
          </div>
        </Card>
      </div>
    </div>
  )
}