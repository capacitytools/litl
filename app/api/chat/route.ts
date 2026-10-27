import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    // 1. Check if user is logged in (prevents abuse)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to use the AI Tutor.' }, { status: 401 })
    }

    // 2. Get the user's message
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // 3. Check for API Key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI is not configured yet. Missing API Key.' }, { status: 500 })
    }

    // 4. Combine the LITL Tutor persona with the user's question
    // This is more reliable across different Gemini models than systemInstruction
    const promptText = `You are the LITL AI Tutor, a helpful, encouraging educational assistant for Nigerian students. Answer the following question clearly and simply:\n\nUser: ${message}`

    // 5. Call the Gemini API using the latest 2.5-flash model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    )

    const data = await response.json()
    
    // 6. Handle Google API errors (like safety blocks or quota limits)
    if (!response.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json({ 
        error: data.error?.message || 'The AI is currently unavailable. Please try again later.' 
      }, { status: response.status })
    }

    // 7. Ensure we got a valid text response back
    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      return NextResponse.json({ error: 'AI returned an empty response. Try asking differently.' }, { status: 500 })
    }

    const aiText = data.candidates[0].content.parts[0].text

    // 8. Return the answer to the frontend
    return NextResponse.json({ reply: aiText })

  } catch (err: any) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 })
  }
}