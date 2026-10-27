import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is logged in, show personalized dashboard
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-litl-ink mb-2">
          Welcome back, {profile?.full_name || 'Learner'}!
        </h1>
        <p className="text-litl-muted mb-8">What would you like to do today?</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/study">
            <Card className="h-full hover:border-litl-blue transition-colors cursor-pointer bg-blue-50/50">
              <h2 className="text-xl font-bold text-litl-blue mb-2">📚 Study Centre</h2>
              <p className="text-sm text-slate-600">Read notes and learn new topics.</p>
            </Card>
          </Link>
          <Link href="/cbt">
            <Card className="h-full hover:border-litl-blue transition-colors cursor-pointer bg-green-50/50">
              <h2 className="text-xl font-bold text-green-700 mb-2">✍️ CBT Practice</h2>
              <p className="text-sm text-slate-600">Take practice exams and test your knowledge.</p>
            </Card>
          </Link>
          <Link href="/ai">
            <Card className="h-full hover:border-litl-blue transition-colors cursor-pointer bg-purple-50/50">
              <h2 className="text-xl font-bold text-purple-700 mb-2">🤖 AI Tutor</h2>
              <p className="text-sm text-slate-600">Ask questions and get instant help (Coming Soon).</p>
            </Card>
          </Link>
        </div>
      </div>
    )
  }

  // If user is NOT logged in, show public marketing page
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-litl-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 text-center">
          <p className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-litl-wine">
            Akure, Ondo State · Nigeria
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-litl-ink sm:text-5xl">
            Illuminating Minds, <br />
            <span className="text-litl-blue">Empowering Futures.</span>
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base text-litl-muted sm:text-lg">
            Light In the Light (LITL) is a mobile-first Nigerian learning platform for students, parents, and teachers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-litl-ink sm:text-3xl text-center mb-8">
          What we offer
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="text-xl font-bold text-litl-blue mb-2">Study Centre</h3>
            <p className="text-sm text-slate-600">Structured learning materials for primary, secondary, WAEC, NECO, and JAMB.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-litl-blue mb-2">CBT Centre</h3>
            <p className="text-sm text-slate-600">Practise examination-style questions with timing, scoring, and review.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-litl-blue mb-2">AI Learning</h3>
            <p className="text-sm text-slate-600">An AI study assistant to explain topics and generate practice questions.</p>
          </Card>
        </div>
      </section>
    </main>
  )
}