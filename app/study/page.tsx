import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export default async function StudyCentrePage() {
  const supabase = await createClient()
  
  // Fetch all subjects available
  const { data: subjects } = await supabase.from('subjects').select('*').order('name')

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-litl-ink">Study Centre</h1>
        <p className="text-litl-muted mt-2">Select a subject below to start learning.</p>
      </div>

      {!subjects || subjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-litl border border-slate-200">
          <p className="text-slate-500">No subjects available yet. Please check back later!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub) => (
            <Link key={sub.id} href={`/study/${sub.id}`}>
              <Card className="h-full hover:border-litl-blue transition-colors cursor-pointer">
                <h2 className="font-display text-xl font-bold text-litl-blue mb-2">{sub.name}</h2>
                <p className="text-sm text-slate-600 line-clamp-3">{sub.description || 'No description provided.'}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}