import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to use the AI Scanner.' }, { status: 401 })
    }

    const { imageBase64 } = await req.json()
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI is not configured yet. Missing API Key.' }, { status: 500 })
    }

    const promptText = `You are the LITL AI Tutor, a helpful, encouraging educational assistant for Nigerian students. 
Look at the image provided. It contains a math, science, or educational problem. 
Solve the problem step-by-step. Keep the explanation clear and easy to understand for a secondary school student.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: promptText },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }]
        })
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json({ 
        error: data.error?.message || 'The AI is currently busy. Please try again later.' 
      }, { status: response.status })
    }

    let aiText = ''
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      aiText = data.candidates[0].content.parts[0].text
    } else {
      return NextResponse.json({ error: 'AI could not read the image. Please try a clearer photo.' }, { status: 500 })
    }

    return NextResponse.json({ solution: aiText })

  } catch (err: any) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 })
  }
}