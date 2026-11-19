import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force the route to use the edge runtime or allow longer execution if on Vercel Pro
export const maxDuration = 60; 

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

    // 🎯 UPDATED: Using the valid 3.8-flash model. 
    // Added fallback to flash-lite just in case.
    const models = ['gemini-3.8-flash', 'gemini-2.5-flash-lite']
    let aiText = ''
    let lastError = ''

    for (const model of models) {
      try {
        // Added a 45-second timeout to prevent Vercel from hard-killing the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
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
        
        clearTimeout(timeoutId);

        const data = await response.json()
        
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiText = data.candidates[0].content.parts[0].text
          break // Success! Break out of the loop
        } else {
          lastError = data.error?.message || `Model ${model} failed`
          console.log(`Model ${model} failed. Trying next... Reason: ${lastError}`)
        }
      } catch (err: any) {
        // Catch abort/timeout errors
        if (err.name === 'AbortError') {
          lastError = `Model ${model} timed out.`
        } else {
          lastError = err.message
        }
      }
    }

    if (!aiText) {
      return NextResponse.json({ error: `AI failed to respond: ${lastError}` }, { status: 503 })
    }

    return NextResponse.json({ solution: aiText })

  } catch (err: any) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 })
  }
}