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

    const promptText = `You are the LITL AI Tutor, a helpful, encouraging educational assistant for Nigerian students. Answer the following question clearly and simply:\n\nUser: ${message}`

    // Using the model Google explicitly recommended in the error message
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json({ 
        error: data.error?.message || 'The AI is currently unavailable. Please try again later.' 
      }, { status: response.status })
    }

    // Safely extract the text, handling potential API format variations
    let aiText = ''
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      aiText = data.candidates[0].content.parts[0].text
    } else if (data.output_text) {
      aiText = data.output_text // Fallback for new Interactions API format
    } else {
      return NextResponse.json({ error: 'AI returned an empty response. Try asking differently.' }, { status: 500 })
    }

    return NextResponse.json({ reply: aiText })

  } catch (err: any) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 })
  }
}