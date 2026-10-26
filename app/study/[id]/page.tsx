import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { notFound } from 'next/navigation'

export default async function SubjectTopicsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: subject } = await supabase.from('subjects').select('*').eq('id', resolvedParams.id).single()
  if (!subject) notFound()

  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .eq('subject_id', resolvedParams.id)
    .order('created_at', { ascending: true })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/study" className="text-sm text-litl-blue hover:underline mb-4 inline-block">&larr; Back to Subjects</Link>
        <h1 className="font-display text-3xl font-bold text-litl-ink">{subject.name}</h1>
        <p className="text-litl-muted mt-2">{subject.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-litl-ink">Topics</h2>
        {!topics || topics.length === 0 ? (
          <p className="text-slate-500 text-sm">No topics have been added to this subject yet.</p>
        ) : (
          topics.map((topic) => (
            <Link key={topic.id} href={`/study/${subject.id}/${topic.id}`}>
              <Card className="hover:border-litl-blue transition-colors cursor-pointer mb-3">
                <h3 className="font-semibold text-litl-blue">{topic.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{topic.content}</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}