import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'

export default async function TopicPage({
  params
}: {
  params: Promise<{ id: string; topicId: string }>
}) {
  const { id, topicId } = await params
  const supabase = await createClient()

  const { data: topic, error } = await supabase
    .from('topics')
    .select('*')
    .eq('id', topicId)
    .eq('subject_id', id)
    .single()

  if (error || !topic) {
    notFound()
  }

  // 🎨 This function splits the text and styles the headings
  const renderBeautifulContent = (content: string) => {
    // Split text by new lines (handles both \n and \r\n)
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '')
    
    // Color palette for the sections
    const bgColors = [
      'bg-sky-50 border-sky-100 text-sky-900', 
      'bg-green-50 border-green-100 text-green-900',
      'bg-indigo-50 border-indigo-100 text-indigo-900',
      'bg-orange-50 border-orange-100 text-orange-900'
    ]

    let sectionIndex = 0;

    return lines.map((line, index) => {
      const trimmed = line.trim();
      
      // Check if this line is a heading (starts with a number like 1.1 or is ALL CAPS)
      const isHeading = /^\d+\.\d+/.test(trimmed) || (trimmed === trimmed.toUpperCase() && trimmed.length > 5 && !trimmed.includes(':'));

      if (isHeading) {
        const colorClass = bgColors[sectionIndex % bgColors.length];
        sectionIndex++; // Move to next color for the next heading
        
        return (
          <div key={index} className={`mt-6 mb-3 p-4 rounded-xl border-2 shadow-sm ${colorClass}`}>
            <h2 className="font-bold text-lg md:text-xl tracking-tight">{trimmed}</h2>
          </div>
        )
      }

      // Regular text paragraph
      return (
        <p key={index} className="text-slate-700 leading-relaxed mb-3 ml-2 md:ml-4">
          {trimmed}
        </p>
      )
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link 
        href={`/study/${id}`} 
        className="inline-flex items-center text-sm font-semibold text-litl-blue hover:underline mb-6"
      >
        <span className="mr-2">←</span> Back to Subject
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-litl-ink mb-2">{topic.title}</h1>
      </div>

      <Card className="p-6 md:p-8 bg-white/50 backdrop-blur-sm">
        <div className="prose prose-slate max-w-none">
          {renderBeautifulContent(topic.content || '')}
        </div>
      </Card>
    </div>
  )
}