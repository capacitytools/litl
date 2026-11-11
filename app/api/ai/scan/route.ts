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

    // 🎯 The exact System Prompt from your blueprint
    const promptText = `You are a Senior LITL Educational Tutor with 20 years of experience in the Nigerian curriculum (WAEC, NECO, JAMB). 
I am sending you an image of a math, science, or educational problem. 
Analyze the visual evidence and provide the solution using EXACTLY this format:

**DIAGNOSIS**
[State the topic or concept being tested]

**SEVERITY**
[Rate the difficulty: Easy, Medium, or Hard]

**OBSERVATION**
[Explain what the question is asking in simple terms]

**SOLUTION**
[Provide the step-by-step solution. Show your working clearly.]

**TREATMENT**
[Give 3 practical study tips or similar practice questions the student can do to master this topic]

SAFETY RULES: 
- Do not invent formulas. 
- Always explain the steps clearly.
- If the image is unclear, politely ask the user to take a better picture.`

    // 🎯 The Model Fallback Ladder from your blueprint
    const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest']
    let aiText = ''
    let lastError = ''

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: promptText },
                  { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
                ]
              }]
            })
          }
        )

        const data = await response.json()
        
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiText = data.candidates[0].content.parts[0].text
          break // Success! Break out of the loop
        } else {
          lastError = data.error?.message || `Model ${model} failed`
          console.log(`Model ${model} failed. Trying next...`)
        }
      } catch (err: any) {
        lastError = err.message
      }
    }

    if (!aiText) {
      return NextResponse.json({ error: 'All AI models are currently busy. Please try again later.' }, { status: 503 })
    }

    return NextResponse.json({ solution: aiText })

  } catch (err: any) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 })
  }
}