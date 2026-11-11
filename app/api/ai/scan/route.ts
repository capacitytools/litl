'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function AIScannerPage() {
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert image file to Base64 for the API
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Please select an image under 5MB.')
      return
    }

    setError(null)
    setResult(null)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      // Remove the data:image/jpeg;base64, prefix
      const base64String = (reader.result as string).split(',')[1]
      setImage(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleScan = async () => {
    if (!image) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to scan image')

      setResult(data.solution)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const resetScanner = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-litl-ink mb-2">AI Snap & Solve</h1>
        <p className="text-litl-muted">Take a picture of any math or science problem, and let the AI explain it step-by-step.</p>
      </div>

      <Card className="flex flex-col items-center">
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-litl-blue/50 rounded-litl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <span className="text-5xl mb-4">📸</span>
            <p className="font-semibold text-litl-blue">Tap to Snap or Upload Image</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        ) : (
          <div className="w-full">
            <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-litl mb-4 bg-slate-100" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetScanner} disabled={loading} fullWidth>Retake</Button>
              <Button onClick={handleScan} disabled={loading} fullWidth>
                {loading ? 'Scanning...' : 'Solve Problem'}
              </Button>
            </div>
          </div>
        )}
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
        />
      </Card>

      {error && (
        <div className="mt-6 rounded bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <Card className="mt-6 bg-slate-50">
          <h2 className="font-bold text-litl-ink mb-3">Solution:</h2>
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
            {result}
          </div>
        </Card>
      )}
    </div>
  )
}