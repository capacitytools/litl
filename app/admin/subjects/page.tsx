'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function AdminSubjectsPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Load subjects
  const fetchSubjects = async () => {
    const { data } = await supabase.from('subjects').select('*').order('created_at', { ascending: false })
    if (data) setSubjects(data)
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  // Add subject
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('subjects').insert([{ name, description }])
    
    if (error) {
      alert('Error adding subject: ' + error.message)
    } else {
      setName('')
      setDescription('')
      fetchSubjects() // Refresh the list
    }
    setLoading(false)
  }

  // Delete subject
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject? All topics inside it will also be deleted.')) return
    
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) alert('Error deleting: ' + error.message)
    else fetchSubjects()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-litl-ink">Manage Subjects</h1>
        <Link href="/admin" className="text-sm text-litl-blue hover:underline">&larr; Back to Admin</Link>
      </div>

      <Card className="mb-8">
        <h2 className="font-semibold text-lg mb-4">Add New Subject</h2>
        <form onSubmit={handleAddSubject} className="space-y-4">
          <Input label="Subject Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Mathematics" />
          <Input label="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. JAMB & WAEC syllabus" />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Subject'}</Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-litl-ink">Existing Subjects</h2>
        {subjects.length === 0 ? (
          <p className="text-slate-500 text-sm">No subjects added yet.</p>
        ) : (
          subjects.map((sub) => (
            <Card key={sub.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-litl-ink">{sub.name}</h3>
                <p className="text-sm text-slate-500">{sub.description || 'No description'}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/subjects/${sub.id}`}>
                  <Button variant="outline" size="sm">Manage Topics</Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(sub.id)}>Delete</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}