import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

const stats = [
  { label: "Active alumni", value: "12k+" },
  { label: "Chapters worldwide", value: "48" },
  { label: "Mentorship matches", value: "1.9k" },
  { label: "Years of legacy", value: "46" },
];

const focusAreas = [
  {
    title: "Verified alumni registry",
    description:
      "A trusted database built with approvals, clean records, and careful stewardship.",
  },
  {
    title: "Career & mentorship",
    description:
      "Curated introductions that unlock internships, guidance, and leadership pathways.",
  },
  {
    title: "Events & reunions",
    description:
      "Hybrid gatherings that bring Eldenites together across campuses and continents.",
  },
];

const programs = [
  {
    title: "Global mentorship weekend",
    timeline: "April 2026",
    detail: "Invite-only sessions with alumni leaders and student founders.",
  },
  {
    title: "Heritage scholarship fund",
    timeline: "Ongoing",
    detail: "Support students with tuition grants and study-abroad stipends.",
  },
  {
    title: "City chapter salons",
    timeline: "Quarterly",
    detail: "Small-format dinners for alumni networking and speaker spotlights.",
  },
];

const testimonials = [
  {
    name: "Dr. Rhea Malhotra",
    role: "Class of 2004 · Cardiologist, Mayo Clinic",
    quote:
      "EHSAS keeps our traditions alive while opening new doors for the next generation.",
  },
  {
    name: "Arjun Mehta",
    role: "Class of 2010 · Founder, Lumen Labs",
    quote:
      "The network feels intentional, curated, and deeply supportive of alumni growth.",
  },
  {
    name: "Sana Rahman",
    role: "Class of 2016 · UN Policy Fellow",
    quote:
      "Elden Heights always taught us to lead with heart. EHSAS amplifies that mission.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-white/70 backdrop-blur">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-crimson">
              EHSAS
            </p>
            <p className="font-serif text-2xl text-charcoal">
              Elden Heights Alumni Society
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-charcoal/70">
            <Link href="/register" className="hover:text-charcoal">
              Register
            </Link>
            <Link href="/privacy" className="hover:text-charcoal">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-charcoal">
              Terms
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-charcoal/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-charcoal transition hover:border-crimson hover:text-crimson"
            >
              Admin
            </Link>
          </nav>
        </Container>
      </header>

      <main className="space-y-24 pb-24">
        <section className="pt-14 md:pt-20">
          <Container className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-crimson">
                  Alumni network
                </span>
                <h1 className="font-serif text-4xl leading-tight text-charcoal md:text-6xl">
                  Elevate the Elden Heights legacy.
                </h1>
                <p className="max-w-xl text-lg text-charcoal/70">
                  A modern alumni society that blends tradition, mentorship, and
                  global connections for every Eldenite.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-crimson px-7 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                >
                  Become a member
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-charcoal/30 bg-white/70 px-7 py-3 text-sm font-semibold text-charcoal transition hover:border-charcoal/60 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  aria-label="Discover the community"
                >
                  Discover the community
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border/60 bg-white/80 px-5 py-4 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.45)]"
                  >
                    <p className="text-2xl font-semibold text-charcoal">
                      {stat.value}
                    </p>
                    <p className="text-xs uppercase tracking-[0.25em] text-charcoal/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[32px] border border-border/70 bg-gradient-to-br from-crimson/10 via-white to-mist p-8 shadow-[0_25px_70px_-45px_rgba(30,41,59,0.55)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
                  Community first
                </p>
                <h2 className="mt-4 font-serif text-3xl text-charcoal">
                  A curated experience for alumni across generations.
                </h2>
                <p className="mt-4 text-sm text-charcoal/70">
                  From verified profiles to chapter programming, every detail
                  is designed to strengthen connection and impact.
                </p>
              </div>
              <div className="rounded-[28px] border border-border/60 bg-white/80 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50">
                  Next reunion
                </p>
                <p className="mt-3 font-serif text-2xl text-charcoal">
                  Founders Day 2025
                </p>
                <p className="mt-2 text-sm text-charcoal/70">
                  December 14 · Elden Heights Campus · In-person & virtual
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
                  <span>Join the waitlist</span>
                  <span className="h-1 w-1 rounded-full bg-crimson" />
                  <span>2,430 interested</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <SectionHeading
              eyebrow="Why EHSAS"
              title="A modern society with heritage at its core"
              description="We preserve Elden Heights traditions while building new pathways for mentorship, giving, and professional growth."
            />
            <div className="grid gap-6">
              {focusAreas.map((area) => (
                <div
                  key={area.title}
                  className="rounded-[24px] border border-border/60 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)]"
                >
                  <p className="font-serif text-xl text-charcoal">
                    {area.title}
                  </p>
                  <p className="mt-2 text-sm text-charcoal/70">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-gradient-to-b from-mist/70 via-background to-background py-20">
          <Container>
            <SectionHeading
              eyebrow="Programs"
              title="Signature initiatives to connect alumni"
              description="From scholarships to mentorship weekends, every program strengthens the alumni network."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {programs.map((program) => (
                <div
                  key={program.title}
                  className="rounded-[26px] border border-border/60 bg-white/85 p-6 shadow-[0_25px_70px_-55px_rgba(15,23,42,0.4)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
                    {program.timeline}
                  </p>
                  <p className="mt-3 font-serif text-xl text-charcoal">
                    {program.title}
                  </p>
                  <p className="mt-3 text-sm text-charcoal/70">
                    {program.detail}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <SectionHeading
              eyebrow="Voices"
              title="Stories from the alumni community"
              description="Celebrating Eldenites who elevate the spirit of the society."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="flex h-full flex-col justify-between rounded-[28px] border border-border/60 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]"
                >
                  <p className="text-sm text-charcoal/70">
                    “{testimonial.quote}”
                  </p>
                  <div className="mt-6">
                    <p className="font-serif text-lg text-charcoal">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.25em] text-crimson">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="grid gap-10 rounded-[36px] border border-border/60 bg-gradient-to-r from-crimson/15 via-white to-mist px-10 py-12 md:grid-cols-[1.3fr_0.7fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
                  Ready to join?
                </p>
                <h2 className="mt-4 font-serif text-3xl text-charcoal">
                  Be part of the next chapter of Elden Heights.
                </h2>
                <p className="mt-4 text-sm text-charcoal/70">
                  Register in minutes and unlock access to alumni updates, event
                  invites, and mentorship opportunities.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark"
                >
                  Start registration
                </Link>
                <Link
                  href="/privacy"
                  className="text-center text-sm font-semibold text-charcoal/70 hover:text-charcoal"
                >
                  Learn about privacy
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-white/70 py-10">
        <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-xl text-charcoal">
              The Elden Heights School
            </p>
            <p className="text-sm text-charcoal/70">
              Contact:{" "}
              <a
                href="mailto:ehsass@eldenheights.org"
                className="font-semibold text-crimson"
              >
                ehsass@eldenheights.org
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-charcoal/70">
            <Link href="/privacy" className="hover:text-charcoal">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-charcoal">
              Terms
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-charcoal/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:border-crimson hover:text-crimson"
            >
              Admin Login
            </Link>
          </div>
        </Container>
      </footer>
    </div>
  );
}
