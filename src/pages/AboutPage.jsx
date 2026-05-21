import { Camera, Mail, MapPin, ShieldCheck } from "lucide-react";
import { BRAND } from "../data/brand";
import Panel from "../components/ui/Panel";
import InfoPill from "../components/ui/InfoPill";
import SectionHeader from "../components/ui/SectionHeader";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="About"
        title="Professional, simple, and built around your work."
        text="Your about page should feel human and direct. It helps people understand your style, what you shoot, and why they should trust you."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel>
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
            <img
              src={BRAND.profileImage}
              alt="Photographer headshot"
              className="aspect-square w-full rounded-3xl object-cover"
            />

            <div className="space-y-4">
              <h3 className="text-3xl font-semibold">{BRAND.name}</h3>
              <p className="text-zinc-300">{BRAND.bio}</p>

              <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                <InfoPill
                  icon={<MapPin className="h-4 w-4" />}
                  text={BRAND.city}
                />
                <InfoPill
                  icon={<Camera className="h-4 w-4" />}
                  text="Portraits, events, editorial, brand"
                />
                <InfoPill
                  icon={<Mail className="h-4 w-4" />}
                  text={BRAND.email}
                />
                <InfoPill
                  icon={<ShieldCheck className="h-4 w-4" />}
                  text="Source and permission tracking built in"
                />
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <h4 className="text-xl font-semibold">
            What makes this site easy to edit
          </h4>

          <div className="mt-5 space-y-4 text-sm text-zinc-300">
            <p>
              All gallery content is stored in one list near the top of the
              project, so you do not have to hunt through lots of layout code.
            </p>
            <p>
              Each image entry has a matching place for source details and
              permission proof. That makes it easy to show that a person
              approved the use of their image.
            </p>
            <p>
              The contact form is already wired for a no-backend email workflow
              using Formspree, which keeps setup simple.
            </p>
            <p>{BRAND.portfolioNote}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
