import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GALLERY_ITEMS, PHOTO_CATEGORIES } from "../data/gallery";
import GalleryGrid from "../components/gallery/GalleryGrid";
import SectionHeader from "../components/ui/SectionHeader";

export default function GalleryPage({ setSelectedItem }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const text = `${item.title} ${item.description} ${item.category} ${item.location}`;
      const matchesSearch = text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Gallery"
        title="Browse by category, then tap any image for details."
        text="This layout is simple on purpose: large thumbnails, clear filters, and easy image details."
      />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, place, or style"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PHOTO_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <GalleryGrid items={filteredItems} openItem={setSelectedItem} />
    </div>
  );
}
