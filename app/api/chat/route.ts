import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to use the AI Tutor.' }, { status: 401 })
    }

    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI is not configured yet. Missing API Key.' }, { status: 500 })
    }

    // We will use the standard Gemini API endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    )

    const data = await response.json()
    
    // If Google returns an error, pass that exact error back to our frontend
    if (!response.ok) {
      console.error('Gemini Error:', data)
      return NextResponse.json({ error: data.error?.message || 'Failed to fetch from Gemini' }, { status: response.status })
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      return NextResponse.json({ error: 'AI returned an empty response.' }, { status: 500 })
    }

    const aiText = data.candidates[0].content.parts[0].text

    return NextResponse.json({ reply: aiText })

  } catch (err: any) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}