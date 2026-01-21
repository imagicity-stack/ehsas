import Link from "next/link";
import { Container } from "@/components/Container";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Container className="py-20">
        <div className="max-w-3xl space-y-6 rounded-[36px] border border-border/60 bg-white/85 p-10 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)]">
          <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-crimson">
            Terms
          </span>
          <h1 className="font-serif text-4xl text-charcoal">Terms of Use</h1>
          <p className="text-sm text-charcoal/70">
            This is a placeholder terms of use for EHSAS. It will define alumni
            participation, acceptable use, and service expectations. A complete
            version will be published soon.
          </p>
          <Link href="/" className="text-sm font-semibold text-crimson">
            Return to home
          </Link>
        </div>
      </Container>
    </div>
  );
}
