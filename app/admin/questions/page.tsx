'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function ManageQuestionsPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedSubject, setSelectedSubject] = useState('')
  
  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctOption, setCorrectOption] = useState('A')
  const [explanation, setExplanation] = useState('')
  
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from('subjects').select('*').order('name')
      if (data) setSubjects(data)
    }
    fetchSubjects()
  }, [])

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubject) return alert('Please select a subject first.')
    
    setLoading(true)
    const { error } = await supabase.from('questions').insert([{
      subject_id: selectedSubject,
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_option: correctOption,
      explanation
    }])
    
    if (error) alert('Error: ' + error.message)
    else {
      alert('Question added successfully!')
      // Clear form
      setQuestionText(''); setOptionA(''); setOptionB(''); setOptionC(''); setOptionD(''); setExplanation('');
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-litl-ink">Manage CBT Questions</h1>
        <Link href="/admin" className="text-sm text-litl-blue hover:underline">&larr; Back to Admin</Link>
      </div>

      <Card className="mb-8">
        <h2 className="font-semibold text-lg mb-4">Add New Question</h2>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-litl-ink block mb-1">Select Subject</label>
          <select 
            className="w-full rounded-litl border border-slate-300 px-3 py-2 text-sm focus:border-litl-blue focus:outline-none"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            required
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-litl-ink">Question Text</label>
            <textarea value={questionText} onChange={e => setQuestionText(e.target.value)} required rows={3} className="w-full rounded-litl border border-slate-300 px-3 py-2 text-sm focus:border-litl-blue focus:outline-none" placeholder="e.g. What is 2 + 2?" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Option A" value={optionA} onChange={e => setOptionA(e.target.value)} required />
            <Input label="Option B" value={optionB} onChange={e => setOptionB(e.target.value)} required />
            <Input label="Option C" value={optionC} onChange={e => setOptionC(e.target.value)} required />
            <Input label="Option D" value={optionD} onChange={e => setOptionD(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-litl-ink block mb-1">Correct Option</label>
              <select className="w-full rounded-litl border border-slate-300 px-3 py-2 text-sm focus:border-litl-blue focus:outline-none" value={correctOption} onChange={e => setCorrectOption(e.target.value)}>
                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
              </select>
            </div>
            <Input label="Explanation (Optional)" value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Why is this the answer?" />
          </div>

          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Question'}</Button>
        </form>
      </Card>
    </div>
  )
}