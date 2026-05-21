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
    const isPlaceholder = endpoint.includes("your-form-id");

    if (isPlaceholder) {
      setContactStatus({
        type: "warning",
        message:
          "The contact form is ready, but you still need to paste your Formspree endpoint into src/data/contact.js to turn on email sending.",
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
        message:
          "Something went wrong while sending your message. Please try again or email me directly.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Contact"
        title="A contact page that is clear, polished, and easy to use."
        text="The form below is built to send messages to your email once you add your Formspree endpoint."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  required
                  value={contactForm.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 outline-none transition focus:border-white/30"
                  placeholder="Your name"
                />
              </Field>

              <Field label="Email">
                <input
                  required
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 outline-none transition focus:border-white/30"
                  placeholder="you@example.com"
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
                  <option>Events</option>
                  <option>Editorial</option>
                  <option>Brand</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Event date">
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
                placeholder="What kind of session or event are you planning?"
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
                Prefer email? Write directly to {BRAND.email}
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
                {BRAND.email}
              </p>
              <p>
                <span className="font-medium text-white">Phone:</span>{" "}
                {BRAND.phone}
              </p>
              <p>
                <span className="font-medium text-white">Location:</span>{" "}
                {BRAND.city}
              </p>
            </div>
          </Panel>

          <Panel>
            <h3 className="text-xl font-semibold">Best fit for this site</h3>
            <p className="mt-4 text-sm text-zinc-300">
              This portfolio is set up for photographers who want a clean public
              gallery, a simple editing workflow, and a built-in place to show
              source details and permission records.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
