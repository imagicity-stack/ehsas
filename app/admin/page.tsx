"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { firebaseAuth } from "@/lib/firebaseClient";
import { Container } from "@/components/Container";

type RequestItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  yearOfLeaving: string;
  city: string;
  lastHouse: string;
  status: string;
  createdAt: string | null;
  ehsasId?: string | null;
  fullData: Record<string, string>;
};

type ActivityItem = {
  id: string;
  message: string;
  timestamp: string;
};

const statusOptions = ["pending", "approved", "rejected"] as const;

export default function AdminDashboard() {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [status, setStatus] = useState<(typeof statusOptions)[number]>(
    "pending"
  );
  const [items, setItems] = useState<RequestItem[]>([]);
  const [selected, setSelected] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryCounts, setSummaryCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    year: "",
    city: "",
    house: "",
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setUserToken(null);
        return;
      }
      const token = await user.getIdToken();
      setUserToken(token);
    });
    return () => unsubscribe();
  }, []);

  const loadRequests = async (token: string, currentStatus = status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/requests/list?status=${currentStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Not authorized");
      }
      const data = await response.json();
      setItems(data.items ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async (token: string) => {
    const counts: typeof summaryCounts = { pending: 0, approved: 0, rejected: 0 };
    await Promise.all(
      statusOptions.map(async (option) => {
        const response = await fetch(
          `/api/admin/requests/list?status=${option}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          counts[option] = data.items?.length ?? 0;
        }
      })
    );
    setSummaryCounts(counts);
  };

  useEffect(() => {
    if (userToken) {
      void loadRequests(userToken, status);
      void loadSummary(userToken);
    }
  }, [userToken, status]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = filters.search.toLowerCase();
      const matchesQuery =
        !query ||
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query);
      const matchesYear =
        !filters.year || item.yearOfLeaving === filters.year.trim();
      const matchesCity =
        !filters.city ||
        item.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesHouse =
        !filters.house ||
        item.lastHouse.toLowerCase().includes(filters.house.toLowerCase());
      return matchesQuery && matchesYear && matchesCity && matchesHouse;
    });
  }, [items, filters]);

  const summary = useMemo(() => summaryCounts, [summaryCounts]);

  const handleApprove = async (requestId: string) => {
    if (!userToken) return;
    const confirmed = window.confirm(
      "Approve this request and generate an EHSAS ID?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ requestId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to approve");
      }
      setActivity((prev) => [
        {
          id: requestId,
          message: `Approved request ${requestId} (EHSAS ID: ${data.ehsasId}).`,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      await loadRequests(userToken, status);
      await loadSummary(userToken);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to approve");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!userToken) return;
    const reason = window.prompt(
      "Optional: add a rejection reason for the applicant.",
      ""
    );
    const confirmed = window.confirm("Reject this request?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ requestId, reason }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to reject");
      }
      setActivity((prev) => [
        {
          id: requestId,
          message: `Rejected request ${requestId}.`,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      await loadRequests(userToken, status);
      await loadSummary(userToken);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reject");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(firebaseAuth);
    setUserToken(null);
  };

  if (!userToken) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Container className="py-10">
          <div className="rounded-[36px] border border-border/60 bg-white/85 p-10 text-center shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)]">
            <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-crimson">
              Access Required
            </span>
            <h1 className="mt-4 font-serif text-3xl text-charcoal">
              Please log in to continue
            </h1>
            <p className="mt-3 text-sm text-charcoal/70">
              Admin access is restricted to authorized EHSAS staff.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-crimson px-7 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark"
            >
              Go to Admin Login
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-crimson">
              Admin Dashboard
            </span>
            <h1 className="mt-3 font-serif text-3xl text-charcoal">
              EHSAS Admin
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="text-sm font-semibold text-charcoal/70 hover:text-charcoal"
            >
              Return to site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-charcoal/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:border-crimson hover:text-crimson"
            >
              Sign out
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {(["pending", "approved", "rejected"] as const).map((key) => (
            <div
              key={key}
              className="rounded-[28px] border border-border/60 bg-white/85 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
                {key}
              </p>
              <p className="mt-4 font-serif text-3xl text-charcoal">
                {summary[key as keyof typeof summary]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2.2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-border/60 bg-white/85 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal">
                    Pending Requests
                  </h2>
                  <p className="text-sm text-charcoal/70">
                    Review and take action on alumni submissions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStatus(option)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                        status === option
                          ? "bg-crimson text-white"
                          : "border border-border/60 text-charcoal/70 hover:border-crimson"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <input
                  placeholder="Search by name or email"
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-border/60 bg-white/85 px-4 py-2 text-sm outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20 md:col-span-2"
                />
                <input
                  placeholder="Year of Leaving"
                  value={filters.year}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      year: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-border/60 bg-white/85 px-4 py-2 text-sm outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20"
                />
                <input
                  placeholder="City"
                  value={filters.city}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      city: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-border/60 bg-white/85 px-4 py-2 text-sm outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20"
                />
                <input
                  placeholder="House"
                  value={filters.house}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      house: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-border/60 bg-white/85 px-4 py-2 text-sm outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20"
                />
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-border/60">
                <table className="w-full text-left text-sm">
                  <thead className="bg-mist/80 text-xs uppercase tracking-[0.2em] text-charcoal/70">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Batch</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-mist/40">
                        <td className="px-4 py-3 font-semibold text-charcoal">
                          {item.firstName} {item.lastName}
                        </td>
                        <td className="px-4 py-3 text-charcoal/70">
                          {item.email}
                        </td>
                        <td className="px-4 py-3 text-charcoal/70">
                          {item.yearOfLeaving}
                        </td>
                        <td className="px-4 py-3 text-charcoal/70">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-charcoal/70">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setSelected(item)}
                              className="text-xs font-semibold text-crimson"
                            >
                              View
                            </button>
                            {item.status === "pending" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(item.id)}
                                  className="text-xs font-semibold text-emerald-700"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(item.id)}
                                  className="text-xs font-semibold text-red-600"
                                >
                                  Reject
                                </button>
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filteredItems.length ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-sm text-charcoal/60"
                        >
                          {loading ? "Loading..." : "No requests found."}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            {selected ? (
              <div className="rounded-[28px] border border-border/60 bg-white/85 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-crimson">
                      Request detail
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-charcoal">
                      {selected.firstName} {selected.lastName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-xs font-semibold text-charcoal/60"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-6 grid gap-4 text-sm text-charcoal/70 md:grid-cols-2">
                  {Object.entries(selected.fullData).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50">
                        {key}
                      </p>
                      <p className="font-semibold text-charcoal">{value}</p>
                    </div>
                  ))}
                </div>
                {selected.status === "pending" ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleApprove(selected.id)}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(selected.id)}
                      className="rounded-full border border-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600"
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-border/60 bg-white/85 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]">
              <h3 className="font-serif text-xl text-charcoal">Notifications</h3>
              <p className="text-xs text-charcoal/60">
                Latest admin actions this session.
              </p>
              <div className="mt-4 space-y-3">
                {activity.slice(0, 20).map((entry) => (
                  <div
                    key={entry.id + entry.timestamp}
                    className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-xs text-charcoal/70"
                  >
                    <p className="font-semibold text-charcoal">
                      {entry.message}
                    </p>
                    <p className="text-[11px] text-charcoal/50">
                      {entry.timestamp}
                    </p>
                  </div>
                ))}
                {!activity.length ? (
                  <p className="text-xs text-charcoal/50">No actions yet.</p>
                ) : null}
              </div>
            </div>
            <div className="rounded-[28px] border border-border/60 bg-white/85 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]">
              <h3 className="font-serif text-xl text-charcoal">Quick Tips</h3>
              <ul className="mt-4 space-y-3 text-xs text-charcoal/70">
                <li>Approve requests after verifying alumni details.</li>
                <li>Use search and filters to find cohorts faster.</li>
                <li>Every approval generates a unique EHSAS ID.</li>
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
