import Link from "next/link";
import { Container } from "@/components/Container";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Container className="py-20">
        <div className="max-w-3xl space-y-6 rounded-3xl border border-border bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
            Terms
          </p>
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
