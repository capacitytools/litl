import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export default async function MarketplacePage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-litl-ink">LITL Marketplace</h1>
        <p className="text-litl-muted mt-2">Premium revision packs, ebooks, and resources.</p>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-litl border border-slate-200">
          <p className="text-slate-500">No products available yet. Please check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((prod) => (
            <Card key={prod.id} className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-litl-blue mb-2">{prod.name}</h2>
                <p className="text-sm text-slate-600 mb-4">{prod.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-bold text-litl-ink">₦{prod.price.toLocaleString()}</span>
                <Link 
                  href={`/checkout/${prod.id}`}
                  className="rounded-litl bg-litl-blue px-4 py-2 text-sm font-semibold text-white hover:bg-litl-blue-dark transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}