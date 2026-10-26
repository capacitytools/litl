import Link from "next/link";

const services = [
  {
    title: "Study Centre",
    description:
      "Structured learning materials for primary, secondary, WAEC, NECO, and JAMB — organised by subject and topic.",
    tag: "Learn",
  },
  {
    title: "CBT Centre",
    description:
      "Practise examination-style questions with timing, scoring, and review — right from your phone.",
    tag: "Practise",
  },
  {
    title: "AI Learning",
    description:
      "An AI study assistant to explain topics, generate practice questions, and help you revise — coming soon.",
    tag: "Assist",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-litl bg-litl-blue text-white font-bold">
              L
            </span>
            <span className="font-display text-lg font-semibold text-litl-blue">
              Light In the Light
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm text-litl-muted sm:flex">
            <Link href="/study" className="hover:text-litl-blue">
              Study
            </Link>
            <Link href="/cbt" className="hover:text-litl-blue">
              CBT
            </Link>
            <Link href="/about" className="hover:text-litl-blue">
              About
            </Link>
            <Link href="/contact" className="hover:text-litl-blue">
              Contact
            </Link>
          </nav>
          <Link
            href="/login"
            className="rounded-litl bg-litl-blue px-4 py-2 text-sm font-semibold text-white hover:bg-litl-blue-dark"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-litl-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-litl-wine">
            Akure, Ondo State · Nigeria
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-litl-ink sm:text-5xl">
            Illuminating Minds,{" "}
            <span className="text-litl-blue">Empowering Futures.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-litl-muted sm:text-lg">
            Light In the Light (LITL) is a mobile-first Nigerian learning
            platform for students, parents, and teachers — from primary school
            through WAEC, NECO, and JAMB preparation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/study"
              className="rounded-litl bg-litl-blue px-6 py-3 text-center text-sm font-semibold text-white hover:bg-litl-blue-dark"
            >
              Explore the Study Centre
            </Link>
            <Link
              href="/cbt"
              className="rounded-litl border border-litl-blue px-6 py-3 text-center text-sm font-semibold text-litl-blue hover:bg-white"
            >
              Try CBT Practice
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-litl-ink sm:text-3xl">
          What we are building
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-litl-muted sm:text-base">
          A connected learning ecosystem — not a collection of unrelated pages.
          Every service shares one account, one dashboard, and one curriculum.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="rounded-litl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="inline-block rounded-full bg-litl-gold/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-litl-gold-dark">
                {s.tag}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-litl-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-litl-muted">{s.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-litl-blue">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                Talk to LITL
              </h2>
              <p className="mt-1 text-sm text-white/80">
                We'd love to hear from students, parents, schools, and teachers.
              </p>
            </div>
            <div className="text-sm text-white">
              <p>
                📞{" "}
                <a href="tel:08066792054" className="underline">
                  0806 679 2054
                </a>
              </p>
              <p className="mt-1">
                ✉️{" "}
                <a
                  href="mailto:damilolavictor82@gmail.com"
                  className="underline break-all"
                >
                  damilolavictor82@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-litl-muted sm:px-6">
          <p>
            © {new Date().getFullYear()} Light In the Light (LITL) · Akure,
            Ondo State, Nigeria.
          </p>
        </div>
      </footer>
    </main>
  );
}
