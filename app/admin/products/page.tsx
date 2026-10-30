'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('products').insert([{ 
      name, 
      description, 
      price: Number(price), 
      download_url: downloadUrl 
    }])
    
    if (error) {
      alert('Error adding product: ' + error.message)
    } else {
      setName('')
      setDescription('')
      setPrice('')
      setDownloadUrl('')
      fetchProducts()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-litl-ink">Manage Marketplace</h1>
        <Link href="/admin" className="text-sm text-litl-blue hover:underline">&larr; Back to Admin</Link>
      </div>

      <Card className="mb-8">
        <h2 className="font-semibold text-lg mb-4">Add New Digital Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. JAMB 2026 Mathematics Revision Pack" />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-litl-ink">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full rounded-litl border border-slate-300 px-3 py-2 text-sm focus:border-litl-blue focus:outline-none"
              placeholder="What is included in this pack?"
            />
          </div>

          <Input label="Price (₦ Naira)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 2500" />
          <Input label="Download URL (Google Drive, Dropbox, etc.)" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="https://..." />
          
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-litl-ink">Existing Products</h2>
        {products.length === 0 ? (
          <p className="text-slate-500 text-sm">No products added yet.</p>
        ) : (
          products.map((prod) => (
            <Card key={prod.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-litl-ink">{prod.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{prod.description}</p>
                <p className="text-sm font-bold text-litl-blue mt-1">₦{prod.price.toLocaleString()}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-red-600 self-start sm:self-center" onClick={() => handleDelete(prod.id)}>Delete</Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}