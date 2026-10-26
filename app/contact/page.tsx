import { Card } from '@/components/ui/Card'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-litl-blue mb-6">Contact Us</h1>
      <Card>
        <p className="text-litl-ink mb-4">We'd love to hear from you.</p>
        <div className="space-y-2 text-sm">
          <p>📞 <strong>Phone:</strong> <a href="tel:08066792054" className="text-litl-blue">0806 679 2054</a></p>
          <p>✉️ <strong>Email:</strong> <a href="mailto:damilolavictor82@gmail.com" className="text-litl-blue break-all">damilolavictor82@gmail.com</a></p>
          <p>📍 <strong>Location:</strong> Akure, Ondo State, Nigeria</p>
        </div>
      </Card>
    </div>
  )
}