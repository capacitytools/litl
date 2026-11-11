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
  
  // We now have two separate refs for the two different inputs
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

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
    // Reset file inputs so the same file can be selected again if needed
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  const renderResult = (text: string) => {
    const sections = text.split(/\*\*(.*?)\*\*/g).filter(Boolean);
    const blocks = [];
    for (let i = 0; i < sections.length; i += 2) {
      const title = sections[i].trim();
      const content = sections[i + 1]?.trim() || '';
      if (title && content) blocks.push({ title, content });
    }

    if (blocks.length === 0) return <p className="whitespace-pre-wrap">{text}</p>;

    return blocks.map((block, idx) => {
      let color = 'bg-slate-50 border-slate-200 text-slate-700';
      let titleColor = 'text-litl-ink';
      
      if (block.title.includes('DIAGNOSIS')) {
        color = 'bg-red-50 border-red-200'; titleColor = 'text-red-700';
      } else if (block.title.includes('SEVERITY') || block.title.includes('OBSERVATION')) {
        color = 'bg-yellow-50 border-yellow-200'; titleColor = 'text-yellow-700';
      } else if (block.title.includes('SOLUTION') || block.title.includes('TREATMENT')) {
        color = 'bg-green-50 border-green-200'; titleColor = 'text-green-700';
      }

      return (
        <div key={idx} className={`p-4 rounded-litl border mb-3 ${color}`}>
          <h3 className={`font-bold mb-1 ${titleColor}`}>{block.title}</h3>
          <p className="whitespace-pre-wrap text-sm">{block.content}</p>
        </div>
      )
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-litl-ink mb-2">AI Snap & Solve</h1>
        <p className="text-litl-muted">Take a picture or upload an image, and let the AI explain it step-by-step.</p>
      </div>

      <Card className="flex flex-col items-center p-4">
        {!preview ? (
          <div className="w-full flex flex-col gap-4 py-6 items-center justify-center bg-slate-50/50 rounded-litl border-2 border-dashed border-litl-blue/30">
            <span className="text-4xl mb-2">🧠</span>
            <p className="font-semibold text-litl-ink mb-2">Choose how to add your problem</p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm px-4">
              {/* Camera Button */}
              <Button 
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex gap-2 items-center justify-center"
              >
                📷 Take Photo
              </Button>
              
              {/* Gallery Button */}
              <Button 
                variant="outline"
                onClick={() => galleryInputRef.current?.click()}
                className="flex-1 flex gap-2 items-center justify-center"
              >
                🖼️ Upload File
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">JPG, PNG up to 5MB</p>
          </div>
        ) : (
          <div className="w-full relative">
            <div className="relative overflow-hidden rounded-litl mb-4 bg-slate-100 flex justify-center">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
              
              {loading && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse absolute top-0 left-0" style={{ animation: 'scan 2s linear infinite' }} />
                  <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    Analyzing...
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetScanner} disabled={loading} className="flex-1">Retake</Button>
              <Button onClick={handleScan} disabled={loading} className="flex-1">
                {loading ? 'Scanning...' : 'Solve Problem'}
              </Button>
            </div>
          </div>
        )}
        
        {/* 1. Input for Camera (forces camera to open) */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          className="hidden" 
          ref={cameraInputRef} 
          onChange={handleImageChange} 
        />

        {/* 2. Input for Gallery (opens file picker) */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={galleryInputRef} 
          onChange={handleImageChange} 
        />
      </Card>

      {error && (
        <div className="mt-6 rounded bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="font-display text-xl font-bold text-litl-ink mb-4">AI Analysis</h2>
          {renderResult(result)}
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(256px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}