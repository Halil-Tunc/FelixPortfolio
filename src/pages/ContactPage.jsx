import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BRAND } from "../data/brand";
import { CONTACT_CONFIG } from "../data/contact";
import Panel from "../components/ui/Panel";
import Field from "../components/ui/Field";
import SectionHeader from "../components/ui/SectionHeader";

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    projectType: "Portraits",
    eventDate: "",
    message: "",
  });

  const [contactStatus, setContactStatus] = useState({
    type: "idle",
    message: "",
  });

  const handleChange = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setContactStatus({ type: "loading", message: "Sending your message..." });

    const endpoint = CONTACT_CONFIG.formspreeEndpoint;
    const isPlaceholder = !endpoint || endpoint.trim() === "";

    if (isPlaceholder) {
      setContactStatus({
        type: "warning",
        message: `The contact form isn't fully configured yet. Email Felix directly at ${BRAND.email}`,
      });
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          projectType: contactForm.projectType,
          eventDate: contactForm.eventDate,
          message: contactForm.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Message failed to send.");
      }

      setContactStatus({
        type: "success",
        message: CONTACT_CONFIG.successMessage,
      });

      setContactForm({
        name: "",
        email: "",
        projectType: "Portraits",
        eventDate: "",
        message: "",
      });
    } catch {
      setContactStatus({
        type: "error",
        message: `Something went wrong. Please try again or email directly at ${BRAND.email}`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Contact"
        title="Get in touch with Felix."
        text="Whether it's a portrait session, event coverage, or a creative collaboration — send a message and Felix will get back to you."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input
                  required
                  value={contactForm.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 outline-none transition focus:border-white/30"
                  placeholder="First and last name"
                />
              </Field>

              <Field label="Your email">
                <input
                  required
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 outline-none transition focus:border-white/30"
                  placeholder="your@email.com"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project type">
                <select
                  value={contactForm.projectType}
                  onChange={(e) => handleChange("projectType", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 outline-none transition focus:border-white/30"
                >
                  <option>Portraits</option>
                  <option>Events & Concerts</option>
                  <option>Nature & Macro</option>
                  <option>Architecture & Automotive</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Preferred date (optional)">
                <input
                  type="date"
                  value={contactForm.eventDate}
                  onChange={(e) => handleChange("eventDate", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </Field>
            </div>

            <Field label="Tell me about your project">
              <textarea
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 outline-none transition focus:border-white/30"
                placeholder="What kind of session or project do you have in mind?"
              />
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-60"
                disabled={contactStatus.type === "loading"}
              >
                {contactStatus.type === "loading"
                  ? "Sending..."
                  : "Send message"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={`mailto:${BRAND.email}`}
                className="text-sm text-zinc-400 underline underline-offset-4"
              >
                Or email directly: {BRAND.email}
              </a>
            </div>

            {contactStatus.type !== "idle" && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  contactStatus.type === "success"
                    ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : contactStatus.type === "warning"
                    ? "border border-amber-400/20 bg-amber-400/10 text-amber-200"
                    : contactStatus.type === "error"
                    ? "border border-red-400/20 bg-red-400/10 text-red-200"
                    : "border border-white/10 bg-white/5 text-zinc-200"
                }`}
              >
                {contactStatus.message}
              </div>
            )}
          </form>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <h3 className="text-xl font-semibold">Direct contact</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <p>
                <span className="font-medium text-white">Email:</span>{" "}
                <a
                  href={`mailto:${BRAND.email}`}
                  className="underline underline-offset-4"
                >
                  {BRAND.email}
                </a>
              </p>
              <p>
                <span className="font-medium text-white">Location:</span>{" "}
                {BRAND.city}
              </p>
            </div>
          </Panel>

          <Panel>
            <h3 className="text-xl font-semibold">What to share</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                What kind of session or project you have in mind
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                A rough date or timeline if you have one
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                Any style references or ideas you want to share
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
