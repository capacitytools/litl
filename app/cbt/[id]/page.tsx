'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const subjectId = resolvedParams.id
  const router = useRouter()
  const supabase = createClient()

  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('subject_id', subjectId)
        .limit(5)

      if (data) setQuestions(data)
      setLoading(false)
    }
    fetchQuestions()
  }, [subjectId])

  const handleSelect = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questions[currentIndex].id]: option })
  }

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      if (!confirm('You have not answered all questions. Submit anyway?')) return
    }

    setSubmitting(true)
    
    // Send answers to the secure API route
    const res = await fetch('/api/submit-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectId, answers: selectedAnswers })
    })

    const data = await res.json()
    if (res.ok) {
      setResult(data)
    } else {
      alert('Error submitting exam: ' + data.error)
    }
    setSubmitting(false)
  }

  if (loading) return <div className="p-8 text-center">Loading exam...</div>
  if (questions.length === 0) return <div className="p-8 text-center">No questions available for this subject yet.</div>

  // RESULTS SCREEN
  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 text-center">
        <Card>
          <h1 className="text-3xl font-bold text-litl-ink mb-2">Exam Complete!</h1>
          <p className="text-slate-500 mb-6">Here is how you performed.</p>
          <div className="text-6xl font-bold text-litl-blue mb-6">{result.score}%</div>
          <p className="text-lg text-litl-ink mb-8">You got {result.correct} out of {result.total} correct.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Button variant="outline" onClick={() => router.push('/cbt')}>Back to CBT</Button>
          </div>
        </Card>
      </div>
    )
  }

  // EXAM SCREEN
  const currentQuestion = questions[currentIndex]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="font-display text-xl font-bold text-litl-ink">Question {currentIndex + 1} of {questions.length}</h1>
        <div className="text-sm font-semibold bg-litl-blue text-white px-3 py-1 rounded-full">Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%</div>
      </div>

      <Card className="mb-6">
        <p className="text-lg font-medium text-litl-ink mb-6">{currentQuestion.question_text}</p>
        
        <div className="space-y-3">
          {['A', 'B', 'C', 'D'].map((opt) => {
            const optionText = currentQuestion[`option_${opt.toLowerCase()}`]
            const isSelected = selectedAnswers[currentQuestion.id] === opt
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left p-4 rounded-litl border transition-colors ${
                  isSelected ? 'border-litl-blue bg-litl-blue/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-bold mr-3">{opt}.</span> {optionText}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentIndex(prev => prev - 1)} disabled={currentIndex === 0}>Previous</Button>
        
        {currentIndex < questions.length - 1 ? (
          <Button onClick={() => setCurrentIndex(prev => prev + 1)}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Scoring...' : 'Submit Exam'}</Button>
        )}
      </div>
    </div>
  )
}