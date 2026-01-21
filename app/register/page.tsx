"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

const houses = [
  "Tagore",
  "Gandhi",
  "Teresa",
  "Kalam",
  "Laxmi",
  "Other",
];

const currentYear = new Date().getFullYear();

const defaultForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  yearOfJoining: "",
  yearOfLeaving: "",
  classOfJoining: "",
  lastClassStudied: "",
  lastHouse: "",
  lastHouseOther: "",
  addressFull: "",
  city: "",
  pincode: "",
  state: "",
  country: "",
};

type FormState = typeof defaultForm;

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success" };

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  const isOtherHouse = form.lastHouse === "Other";

  const errors = useMemo(() => {
    const result: string[] = [];
    if (!form.firstName.trim()) result.push("First name is required.");
    if (!form.lastName.trim()) result.push("Last name is required.");
    if (!form.email.trim()) result.push("Email is required.");
    if (!form.mobile.trim()) result.push("Mobile number is required.");
    if (!form.yearOfJoining.trim()) result.push("Year of joining is required.");
    if (!form.yearOfLeaving.trim()) result.push("Year of leaving is required.");
    if (!form.classOfJoining.trim()) result.push("Class of joining is required.");
    if (!form.lastClassStudied.trim())
      result.push("Last class studied is required.");
    if (!form.lastHouse.trim()) result.push("Last house is required.");
    if (isOtherHouse && !form.lastHouseOther.trim())
      result.push("Please specify your house.");
    if (!form.addressFull.trim()) result.push("Full address is required.");
    if (!form.city.trim()) result.push("City is required.");
    if (!form.pincode.trim()) result.push("Pincode is required.");
    if (!form.state.trim()) result.push("State is required.");
    if (!form.country.trim()) result.push("Country is required.");

    const mobileDigits = form.mobile.replace(/\D/g, "");
    if (mobileDigits && mobileDigits.length !== 10) {
      result.push("Mobile number must be 10 digits.");
    }

    const joinYear = Number(form.yearOfJoining);
    const leaveYear = Number(form.yearOfLeaving);
    if (joinYear && (joinYear < 1900 || joinYear > currentYear)) {
      result.push("Year of joining must be between 1900 and current year.");
    }
    if (leaveYear && (leaveYear < 1900 || leaveYear > currentYear)) {
      result.push("Year of leaving must be between 1900 and current year.");
    }
    if (joinYear && leaveYear && leaveYear < joinYear) {
      result.push("Year of leaving must be after year of joining.");
    }

    return result;
  }, [form, isOtherHouse]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (errors.length) {
      setSubmitState({
        status: "error",
        message: errors[0],
      });
      return;
    }

    setSubmitState({ status: "loading" });
    try {
      const payload = {
        ...form,
        lastHouse: isOtherHouse ? form.lastHouseOther : form.lastHouse,
      };

      const response = await fetch("/api/requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }
      setSubmitState({ status: "success" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit request.";
      setSubmitState({ status: "error", message });
    }
  };

  if (submitState.status === "success") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Container className="py-24">
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-10 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
              Request submitted
            </p>
            <h1 className="mt-4 font-serif text-3xl text-charcoal">
              Thanks. Your request is submitted.
            </h1>
            <p className="mt-4 text-sm text-charcoal/70">
              You will receive an approval email soon. If you need to update
              your information, please contact us at{" "}
              <a
                href="mailto:ehsass@eldenheights.org"
                className="font-semibold text-crimson"
              >
                ehsass@eldenheights.org
              </a>
              .
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              >
                Return home
              </Link>
              <Link
                href="/privacy"
                className="text-sm font-semibold text-charcoal/70 hover:text-charcoal"
              >
                Privacy policy
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Container className="py-16 md:py-24">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
              Registration
            </p>
            <h1 className="font-serif text-4xl text-charcoal">
              Alumni Registration
            </h1>
            <p className="max-w-2xl text-sm text-charcoal/70">
              Submit your details for verification. Once approved, you will
              receive your EHSAS ID and access to alumni updates.
            </p>
          </div>

          {submitState.status === "error" ? (
            <div className="rounded-2xl border border-crimson/40 bg-red-50 px-4 py-3 text-sm text-crimson">
              {submitState.message}
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="space-y-10 rounded-3xl border border-border bg-white p-8 shadow-sm"
          >
            <SectionHeading
              eyebrow="Student's Profile"
              title="Student's Profile"
              description="Share your academic journey so we can verify your alumni status."
              className="border-b border-border pb-6"
            />

            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: "First Name", name: "firstName", required: true },
                { label: "Last Name", name: "lastName", required: true },
                { label: "Email Id", name: "email", type: "email" },
                { label: "Mobile Number", name: "mobile" },
                {
                  label: "Year of Joining",
                  name: "yearOfJoining",
                  type: "number",
                },
                {
                  label: "Year of Leaving",
                  name: "yearOfLeaving",
                  type: "number",
                },
                { label: "Class of Joining", name: "classOfJoining" },
                { label: "Last Class Studied", name: "lastClassStudied" },
              ].map((field) => (
                <label key={field.name} className="space-y-2 text-sm">
                  <span className="text-charcoal">
                    {field.label}
                    <span className="text-crimson">*</span>
                  </span>
                  <input
                    name={field.name}
                    type={field.type ?? "text"}
                    value={form[field.name as keyof FormState]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm text-charcoal outline-none transition focus:border-crimson"
                  />
                </label>
              ))}
              <label className="space-y-2 text-sm">
                <span className="text-charcoal">
                  Last House while in School<span className="text-crimson">*</span>
                </span>
                <select
                  name="lastHouse"
                  value={form.lastHouse}
                  onChange={handleSelect}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-charcoal outline-none transition focus:border-crimson"
                >
                  <option value="">Select</option>
                  {houses.map((house) => (
                    <option key={house} value={house}>
                      {house}
                    </option>
                  ))}
                </select>
              </label>
              {isOtherHouse ? (
                <label className="space-y-2 text-sm">
                  <span className="text-charcoal">
                    Specify House<span className="text-crimson">*</span>
                  </span>
                  <input
                    name="lastHouseOther"
                    value={form.lastHouseOther}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm text-charcoal outline-none transition focus:border-crimson"
                  />
                </label>
              ) : null}
            </div>

            <SectionHeading
              eyebrow="Address"
              title="Address"
              description="Your current location helps us connect alumni in the same region."
              className="border-b border-border pb-6"
            />
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="text-charcoal">
                  Full Address<span className="text-crimson">*</span>
                </span>
                <textarea
                  name="addressFull"
                  value={form.addressFull}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-border px-4 py-3 text-sm text-charcoal outline-none transition focus:border-crimson"
                />
              </label>
              {[
                { label: "City", name: "city" },
                { label: "Pincode", name: "pincode" },
                { label: "State", name: "state" },
                { label: "Country", name: "country" },
              ].map((field) => (
                <label key={field.name} className="space-y-2 text-sm">
                  <span className="text-charcoal">
                    {field.label}
                    <span className="text-crimson">*</span>
                  </span>
                  <input
                    name={field.name}
                    value={form[field.name as keyof FormState]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm text-charcoal outline-none transition focus:border-crimson"
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-charcoal/60">
                By submitting, you agree to our verification process and data
                handling guidelines.
              </p>
              <button
                type="submit"
                disabled={submitState.status === "loading"}
                className="inline-flex items-center justify-center rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitState.status === "loading"
                  ? "Submitting..."
                  : "Submit for Approval"}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
