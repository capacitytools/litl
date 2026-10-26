'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function ManageTopicsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const subjectId = resolvedParams.id

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [topics, setTopics] = useState<any[]>([])
  const [subject, setSubject] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchData = async () => {
    // Get subject details
    const { data: subData } = await supabase.from('subjects').select('*').eq('id', subjectId).single()
    if (subData) setSubject(subData)

    // Get topics for this subject
    const { data: topData } = await supabase.from('topics').select('*').eq('subject_id', subjectId).order('created_at', { ascending: true })
    if (topData) setTopics(topData)
  }

  useEffect(() => {
    fetchData()
  }, [subjectId])

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('topics').insert([{ 
      subject_id: subjectId, 
      title, 
      content 
    }])
    
    if (error) {
      alert('Error adding topic: ' + error.message)
    } else {
      setTitle('')
      setContent('')
      fetchData()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this topic?')) return
    const { error } = await supabase.from('topics').delete().eq('id', id)
    if (!error) fetchData()
  }

  if (!subject) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-litl-ink">Manage Topics</h1>
          <p className="text-litl-blue font-semibold">{subject.name}</p>
        </div>
        <Link href="/admin/subjects" className="text-sm text-litl-blue hover:underline">&larr; Back to Subjects</Link>
      </div>

      <Card className="mb-8">
        <h2 className="font-semibold text-lg mb-4">Add New Topic</h2>
        <form onSubmit={handleAddTopic} className="space-y-4">
          <Input label="Topic Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Introduction to Algebra" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-litl-ink">Study Notes (Content)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full rounded-litl border border-slate-300 px-3 py-2 text-sm focus:border-litl-blue focus:outline-none"
              placeholder="Type the learning material here..."
            />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Topic'}</Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-litl-ink">Topics in this Subject</h2>
        {topics.length === 0 ? (
          <p className="text-slate-500 text-sm">No topics added yet.</p>
        ) : (
          topics.map((topic) => (
            <Card key={topic.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-litl-ink">{topic.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{topic.content}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-red-600 self-start sm:self-center" onClick={() => handleDelete(topic.id)}>Delete</Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}