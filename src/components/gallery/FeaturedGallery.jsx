import { ArrowRight } from "lucide-react";
import GalleryCard from "./GalleryCard";
import SectionHeader from "../ui/SectionHeader";

export default function FeaturedGallery({ items, openItem, navigate }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Featured work"
          title="A clean first impression"
          text="Featured images give visitors a quick feel for your style before they browse the full gallery."
        />

        <button
          onClick={() => navigate("gallery")}
          className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          Open full gallery
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <GalleryCard
            key={item.id}
            item={item}
            onClick={() => openItem(item)}
          />
        ))}
      </div>
    </section>
  );
}
