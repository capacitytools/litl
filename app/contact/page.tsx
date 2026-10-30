import { Card } from '@/components/ui/Card'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-litl-ink mb-2">Contact Us</h1>
        <p className="text-litl-muted">We'd love to hear from you.</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-litl-ink text-lg mb-1">Phone</h3>
            <a href="tel:08066792054" className="text-litl-blue hover:underline text-lg">0806 679 2054</a>
          </div>
          
          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-litl-ink text-lg mb-1">Email</h3>
            <a href="mailto:damilolavictor82@gmail.com" className="text-litl-blue hover:underline break-all">
              damilolavictor82@gmail.com
            </a>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-litl-ink text-lg mb-1">Location</h3>
            <p className="text-slate-600">Akure, Ondo State, Nigeria</p>
          </div>
        </div>
      </Card>
    </div>
  )
}