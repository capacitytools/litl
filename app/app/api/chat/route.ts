import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    // 1. Check if user is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to use the AI Tutor.' }, { status: 401 })
    }

    // 2. Get the user's message
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    // 3. Call the Gemini API securely from the server
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI is not configured yet.' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are the LITL AI Tutor, a helpful educational assistant for Nigerian students. Keep answers clear, encouraging, and easy to understand." }]
          },
          contents: [{ parts: [{ text: message }] }]
        })
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      console.error(data)
      return NextResponse.json({ error: 'AI failed to respond.' }, { status: 500 })
    }

    const aiText = data.candidates[0].content.parts[0].text

    return NextResponse.json({ reply: aiText })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}