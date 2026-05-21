import {
  ArrowRight,
  Camera,
  Filter,
  Image as ImageIcon,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { BRAND } from "../data/brand";
import { QUICK_STEPS, SERVICES } from "../data/services";
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
            Photographer portfolio
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
              Contact me
              <Mail className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 pt-2 text-sm text-zinc-300 sm:grid-cols-3">
            <InfoPill
              icon={<ImageIcon className="h-4 w-4" />}
              text="Clear categories"
            />
            <InfoPill
              icon={<ShieldCheck className="h-4 w-4" />}
              text="Permission tracking"
            />
            <InfoPill
              icon={<Filter className="h-4 w-4" />}
              text="Easy gallery filters"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-white/5 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/30">
            <img
              src={BRAND.heroImage}
              alt="Featured photography hero"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover lg:aspect-[4/4.6]"
            />
          </div>
        </div>
      </section>

      <Panel>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold">
              Built to be easy to edit later
            </h2>
            <p className="text-zinc-300">
              This site is organized so you can change your photos, text, and
              contact settings from one place without digging through a giant
              code file.
            </p>
          </div>

          <div className="grid gap-3 lg:max-w-xl">
            {QUICK_STEPS.map((step) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-sm text-zinc-300"
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="What you shoot"
          title="Space for different kinds of photography"
          text="This structure already supports multiple categories so your portfolio can grow over time."
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
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h2 className="text-3xl font-semibold">
              Your permission and source notes are part of the design
            </h2>

            <p className="max-w-2xl text-zinc-300">
              Instead of keeping permission proof buried somewhere else, this
              design gives you a place to show it clearly.
            </p>

            <button
              onClick={() => navigate("permissions")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
            >
              Open sources + permissions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Panel>

        <Panel>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Navigation goals</h3>

            <div className="grid gap-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                Big buttons and clear labels
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                Simple top menu with only the most important pages
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                Large thumbnails so users can recognize where to click fast
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
