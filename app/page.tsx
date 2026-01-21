import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

const spotlight = [
  {
    name: "Dr. Rhea Malhotra",
    detail: "Class of 2004 · Cardiologist, Mayo Clinic",
    quote:
      "Elden Heights taught me to lead with empathy. EHSAS keeps that spirit alive.",
  },
  {
    name: "Arjun Mehta",
    detail: "Class of 2010 · Founder, Lumen Labs",
    quote:
      "The alumni network is a bridge between our legacy and the future we build.",
  },
  {
    name: "Sana Rahman",
    detail: "Class of 2016 · UN Policy Fellow",
    quote: "EHSAS is where our shared stories become global opportunities.",
  },
];

const events = [
  {
    title: "Founders Day Reunion",
    date: "December 14, 2025",
    location: "Elden Heights Campus",
  },
  {
    title: "Global Alumni Virtual Meet",
    date: "February 08, 2026",
    location: "Online",
  },
  {
    title: "Mentorship Weekend",
    date: "April 12, 2026",
    location: "New Delhi",
  },
];

const givingBack = [
  {
    title: "Mentorship",
    description:
      "Guide current students with career direction, life lessons, and encouragement.",
  },
  {
    title: "Internships",
    description:
      "Open doors with opportunities across industries and geographies.",
  },
  {
    title: "Scholarships",
    description:
      "Create lasting impact through scholarships for deserving students.",
  },
  {
    title: "Donations",
    description:
      "Support campus initiatives, infrastructure, and academic excellence.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-white/80 backdrop-blur">
        <Container className="flex items-center justify-between py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
              EHSAS
            </p>
            <p className="font-serif text-xl text-charcoal">
              Elden Heights Alumni Society
            </p>
          </div>
          <div className="hidden items-center gap-6 text-sm text-charcoal/80 md:flex">
            <span>Since 1978</span>
            <span className="h-5 w-px bg-border" />
            <span>Global Network</span>
          </div>
        </Container>
      </header>

      <main className="space-y-24 pb-24">
        <section className="pt-16 md:pt-24">
          <Container className="grid gap-12 rounded-[40px] border border-border/60 bg-white/80 px-8 py-12 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.6)] md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-crimson">
                  Alumni Society
                </span>
                <h1 className="font-serif text-4xl leading-tight text-charcoal md:text-6xl">
                  EHSAS
                </h1>
                <p className="text-lg text-charcoal/80">
                  Elden Heights School Alumni Society
                </p>
                <p className="max-w-xl text-base text-charcoal/70">
                  A lifelong community of Eldenites across the world. Connect,
                  contribute, celebrate the journey.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                >
                  Join EHSAS
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-charcoal/20 bg-white/60 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-charcoal/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  aria-label="Explore Alumni Network"
                >
                  Explore Alumni Network
                </button>
              </div>
            </div>
            <div className="rounded-[28px] border border-border/60 bg-gradient-to-br from-white via-white to-mist p-8 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.45)]">
              <div className="space-y-6">
                <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson">
                  Harvard-inspired
                </span>
                <h2 className="font-serif text-3xl text-charcoal">
                  A legacy of excellence, refined for today.
                </h2>
                <p className="text-sm text-charcoal/70">
                  Built for alumni who value tradition and purposeful networks,
                  EHSAS blends heritage with modern engagement.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    "Premium editorial design",
                    "Verified alumni registry",
                    "Global chapters",
                    "Mentorship & giving",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-charcoal"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <SectionHeading
              eyebrow="About EHSAS"
              title="Elden Heights School Alumni Society"
              description="EHSAS stands for Elden Heights School Alumni Society. In Hindi, “ehsas” means feeling — the sense of belonging, connection, and shared memory that ties generations of Eldenites together."
            />
            <div className="grid gap-6 rounded-[28px] border border-border/60 bg-white/80 p-8 text-sm text-charcoal/80 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]">
              <p>
                Our alumni society preserves the legacy of Elden Heights while
                creating fresh pathways for collaboration, mentorship, and
                lifelong friendship.
              </p>
              <p>
                Every member carries the spirit of the school forward — across
                continents, careers, and communities.
              </p>
            </div>
          </Container>
        </section>

        <section className="bg-gradient-to-b from-mist/70 to-transparent py-20">
          <Container>
            <SectionHeading
              eyebrow="How it works"
              title="A trusted alumni registry"
              description="From registration to verified access, every step is designed for authenticity, privacy, and belonging."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {[
                "Register your profile",
                "Verified by admin",
                "Receive your EHSAS ID",
                "Access alumni community (coming soon)",
              ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-border/60 bg-white/80 p-6 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 font-serif text-lg text-charcoal">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <SectionHeading
              eyebrow="Alumni spotlight"
              title="Stories that inspire"
              description="Celebrating alumni who shape the world with distinction."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {spotlight.map((alum) => (
                <div
                  key={alum.name}
                  className="flex h-full flex-col justify-between rounded-[28px] border border-border/60 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]"
                >
                  <div className="space-y-4">
                    <p className="font-serif text-xl text-charcoal">
                      {alum.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-crimson">
                      {alum.detail}
                    </p>
                    <p className="text-sm text-charcoal/70">{alum.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-gradient-to-b from-mist to-background py-16">
          <Container>
            <SectionHeading
              eyebrow="Events & Reunions"
              title="Gather with your cohort"
              description="Elegant reunions and virtual sessions that bring Eldenites together."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.title}
                  className="rounded-[28px] border border-border/60 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]"
                >
                  <p className="font-serif text-xl text-charcoal">
                    {event.title}
                  </p>
                  <div className="mt-4 space-y-1 text-sm text-charcoal/70">
                    <p>{event.date}</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <SectionHeading
              eyebrow="Give back"
              title="The next generation thrives with you"
              description="Support Elden Heights by sharing time, opportunities, and resources."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {givingBack.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-border/60 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]"
                >
                  <p className="font-serif text-xl text-charcoal">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm text-charcoal/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              >
                Become a mentor
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-white/80 py-10">
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
