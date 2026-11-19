import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function TopicReaderPage({ params }: { params: Promise<{ id: string, topicId: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: topic } = await supabase.from('topics').select('*').eq('id', resolvedParams.topicId).single()
  if (!topic) notFound()

  const { data: subject } = await supabase.from('subjects').select('name').eq('id', resolvedParams.id).single()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <Link href={`/study/${resolvedParams.id}`} className="text-sm text-litl-blue hover:underline mb-4 inline-block">
          &larr; Back to {subject?.name || 'Subject'}
        </Link>
        <h1 className="font-display text-3xl font-bold text-litl-ink">{topic.title}</h1>
      </div>

      <div className="prose prose-slate prose-blue max-w-none bg-white p-6 sm:p-8 rounded-litl border border-slate-200">
        {/* whitespace-pre-wrap ensures paragraphs and line breaks in the database are rendered correctly */}
        <p className="whitespace-pre-wrap text-litl-ink leading-relaxed">{topic.content}</p>
      </div>
    </div>
  )
}