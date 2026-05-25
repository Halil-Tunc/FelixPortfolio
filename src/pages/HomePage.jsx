import {
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Mail,
} from "lucide-react";
import { BRAND } from "../data/brand";
import { PHOTO_HIGHLIGHTS, SERVICES } from "../data/services";
import { GALLERY_ITEMS } from "../data/gallery";
import FeaturedGallery from "../components/gallery/FeaturedGallery";
import Panel from "../components/ui/Panel";
import InfoPill from "../components/ui/InfoPill";
import SectionHeader from "../components/ui/SectionHeader";

export default function HomePage({ navigate, setSelectedItem }) {
  const featuredItems = GALLERY_ITEMS.filter((item) => item.featured);

  return (
    <div className="space-y-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            <Camera className="h-4 w-4" />
            Photography portfolio
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              {BRAND.name}
            </h1>
            <p className="max-w-2xl text-lg text-zinc-300 sm:text-xl">
              {BRAND.subheading}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("gallery")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition hover:opacity-90"
            >
              View gallery
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate("contact")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Get in touch
              <Mail className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 pt-2 text-sm text-zinc-300 sm:grid-cols-3">
            <InfoPill
              icon={<Camera className="h-4 w-4" />}
              text="Portraits and events"
            />
            <InfoPill
              icon={<ImageIcon className="h-4 w-4" />}
              text="Nature and macro"
            />
            <InfoPill
              icon={<Camera className="h-4 w-4" />}
              text="Architecture and automotive"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-white/5 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/30">
            <img
              src={BRAND.heroImage}
              alt="City light trails — long exposure photography by Felix Aguilar"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover lg:aspect-[4/4.6]"
              fetchpriority="high"
            />
          </div>
        </div>
      </section>

      <Panel>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold">Across the gallery</h2>
            <p className="text-zinc-300">
              Felix's portfolio spans multiple subjects and lighting conditions
              — from clean daylight portraits to long-exposure night shots and
              intimate macro work.
            </p>
          </div>

          <div className="grid gap-3 lg:max-w-xl">
            {PHOTO_HIGHLIGHTS.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-sm text-zinc-300"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="What Felix shoots"
          title="Photography across multiple subjects and styles"
          text="From controlled studio portraits to candid live events, architecture, and close-up macro work."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <Panel key={service.title} className="h-full">
              <div className="space-y-3">
                <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Camera className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-zinc-300">{service.text}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <FeaturedGallery
        items={featuredItems}
        openItem={setSelectedItem}
        navigate={navigate}
      />

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3">
              <Mail className="h-5 w-5" />
            </div>

            <h2 className="text-3xl font-semibold">
              Available for shoots and collaborations
            </h2>

            <p className="max-w-2xl text-zinc-300">
              Reach out to discuss portrait sessions, event coverage, or any
              other photography project.
            </p>

            <button
              onClick={() => navigate("contact")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Panel>

        <Panel>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What to include</h3>

            <div className="grid gap-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                What kind of session or event you have in mind
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                A rough date or timeline if you have one
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                Any style references or ideas you want to share
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
