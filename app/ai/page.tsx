'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function AITutorPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your LITL AI Tutor. What would you like to learn about today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: ' + error.message }])
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-litl-ink">AI Tutor</h1>
        <p className="text-sm text-litl-muted">Ask me to explain any topic!</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-litl px-4 py-2 text-sm ${
                msg.role === 'user' 
                  ? 'bg-litl-blue text-white' 
                  : 'bg-slate-100 text-litl-ink whitespace-pre-wrap'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-slate-400 italic">AI is thinking...</div>}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="border-t border-slate-200 p-3 bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-litl border border-slate-300 px-3 py-2 text-sm focus:border-litl-blue focus:outline-none"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
        </form>
      </Card>
    </div>
  )
}