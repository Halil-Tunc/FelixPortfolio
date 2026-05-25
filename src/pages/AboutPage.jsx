import { Camera, Mail, MapPin } from "lucide-react";
import { BRAND } from "../data/brand";
import Panel from "../components/ui/Panel";
import InfoPill from "../components/ui/InfoPill";
import SectionHeader from "../components/ui/SectionHeader";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="About"
        title="Photography across action, portrait, architecture, nature, and more."
        text="Felix Aguilar is a photographer based in Austin, Texas, working across a wide range of subjects and lighting conditions."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel>
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
                text="Portraits, events, architecture, nature"
              />
              <InfoPill
                icon={<Mail className="h-4 w-4" />}
                text={BRAND.email}
              />
              <InfoPill
                icon={<Camera className="h-4 w-4" />}
                text="Macro, automotive, and low light"
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <h4 className="text-xl font-semibold">Subjects and approach</h4>

          <div className="mt-5 space-y-4 text-sm text-zinc-300">
            <p>
              Felix shoots across a wide range of subjects — from high-energy
              concert floors to quiet architectural details and close-up macro
              work.
            </p>
            <p>
              His approach to color is deliberate, whether using vivid flash
              lighting in portrait sessions or finding natural tones in street
              and nature photography.
            </p>
            <p>
              Black and white work appears throughout his portfolio, particularly
              in concert, automotive, and architectural scenes where contrast and
              form tell the story.
            </p>
            <p>
              Reach out via the contact page for portrait sessions, event
              coverage, or collaborative projects.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
