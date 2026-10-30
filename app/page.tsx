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
              <p className="text-sm text-slate-600">Ask questions and get instant help.</p>
            </Card>
          </Link>
        </div>
      </div>
    )
  }

  // If user is NOT logged in, show public marketing page
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-litl-cream">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-litl-wine border border-litl-wine/20 shadow-sm">
            Akure, Ondo State · Nigeria
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-litl-ink sm:text-5xl md:text-6xl">
            Illuminating Minds, <br />
            <span className="text-litl-blue">Empowering Futures.</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-600">
            The ultimate mobile-first learning platform for Nigerian students. Master your subjects, crush your exams (WAEC, NECO, JAMB), and unlock your potential.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">Create Free Account</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-white">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-center text-litl-ink mb-12">
          Everything you need to succeed
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-t-4 border-t-litl-blue shadow-md">
            <h3 className="text-xl font-bold text-litl-blue mb-2">📚 Study Centre</h3>
            <p className="text-slate-600">Structured learning materials for primary, secondary, WAEC, NECO, and JAMB, organised by subject and topic.</p>
          </Card>
          <Card className="border-t-4 border-t-litl-gold shadow-md">
            <h3 className="text-xl font-bold text-litl-gold-dark mb-2">✍️ CBT Practice</h3>
            <p className="text-slate-600">Practise examination-style questions with timing, instant scoring, and review — right from your phone.</p>
          </Card>
          <Card className="border-t-4 border-t-litl-wine shadow-md">
            <h3 className="text-xl font-bold text-litl-wine mb-2">🤖 AI Tutor</h3>
            <p className="text-slate-600">An intelligent study assistant to explain difficult topics, generate practice questions, and help you revise.</p>
          </Card>
        </div>
      </section>
    </main>
  )
}