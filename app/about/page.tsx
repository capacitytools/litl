import { Card } from '@/components/ui/Card'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-litl-blue mb-4">About LITL</h1>
        <p className="text-xl text-litl-wine font-semibold italic">"Illuminating Minds, Empowering Futures."</p>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-2xl font-bold text-litl-ink mb-3">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            Light In the Light (LITL) was founded in Akure, Ondo State, with a simple but powerful vision: to make high-quality educational resources accessible to every Nigerian student, regardless of their location or background. We believe that with the right guidance and tools, every learner can excel.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-litl-ink mb-3">What We Offer</h2>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start">
              <span className="text-litl-gold mr-2 font-bold">✓</span>
              <span><strong>Study Centre:</strong> Carefully curated notes and topics for WAEC, NECO, and JAMB.</span>
            </li>
            <li className="flex items-start">
              <span className="text-litl-gold mr-2 font-bold">✓</span>
              <span><strong>CBT Centre:</strong> Realistic computer-based practice tests to build confidence.</span>
            </li>
            <li className="flex items-start">
              <span className="text-litl-gold mr-2 font-bold">✓</span>
              <span><strong>AI Tutor:</strong> A 24/7 learning assistant to explain difficult concepts.</span>
            </li>
            <li className="flex items-start">
              <span className="text-litl-gold mr-2 font-bold">✓</span>
              <span><strong>Marketplace:</strong> Premium revision packs and digital resources.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}