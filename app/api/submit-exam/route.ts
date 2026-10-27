import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get the data sent from the browser
    const { subjectId, answers } = await req.json() 
    // answers looks like: { "question-id-1": "A", "question-id-2": "B" }

    if (!subjectId || !answers) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // 3. Fetch the REAL correct answers from the database
    const questionIds = Object.keys(answers)
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, correct_option')
      .in('id', questionIds)

    if (error || !questions) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    // 4. Score the exam on the server
    let correctCount = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) {
        correctCount++
      }
    })

    const score = Math.round((correctCount / questions.length) * 100)

    // 5. Save the attempt to the database
    await supabase.from('exam_attempts').insert([{
      user_id: user.id,
      subject_id: subjectId,
      score: score,
      total_questions: questions.length
    }])

    // 6. Return the final score
    return NextResponse.json({ score, total: questions.length, correct: correctCount })

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}