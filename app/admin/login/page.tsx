"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";
import { Container } from "@/components/Container";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "not-authorized"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const credentials = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const token = await credentials.user.getIdToken();
      const response = await fetch("/api/admin/requests/list?status=pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        await signOut(firebaseAuth);
        setStatus("not-authorized");
        setMessage("Not authorized.");
        return;
      }
      router.push("/admin");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Container className="py-24">
        <div className="mx-auto max-w-md rounded-[36px] border border-border/60 bg-white/85 p-10 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)]">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-crimson">
              Admin Access
            </span>
            <h1 className="font-serif text-3xl text-charcoal">Admin Login</h1>
            <p className="text-sm text-charcoal/70">
              Use your staff credentials to manage EHSAS registration requests.
            </p>
          </div>
          {message ? (
            <div className="mt-6 rounded-2xl border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
              {message}
            </div>
          ) : null}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="space-y-2 text-sm">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-2xl border border-border/60 bg-white/85 px-4 py-3 text-sm outline-none transition focus:border-crimson focus:ring-2 focus:ring-crimson/20"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-border/60 bg-white/85 px-4 py-3 text-sm outline-none transition focus:border-crimson focus:ring-2 focus:ring-crimson/20"
              />
            </label>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
            {status === "not-authorized" ? (
              <p className="text-xs text-charcoal/60">
                Your account does not have admin privileges.
              </p>
            ) : null}
          </form>
        </div>
      </Container>
    </div>
  );
}
