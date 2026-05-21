import { ArrowRight, SlidersHorizontal } from "lucide-react";

export default function GalleryCard({ item, onClick }) {
  const hasBeforeAfter = Boolean(item.beforeAfter?.afterImage);

  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:bg-white/[0.07]"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.alt}
          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/90 backdrop-blur">
              {item.category}
            </span>

            {hasBeforeAfter && (
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100 backdrop-blur">
                <SlidersHorizontal className="h-3 w-3" />
                Before/After
              </span>
            )}

            {item.peoplePhoto && (
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 backdrop-blur">
                {item.permission.status}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:text-white" />
        </div>
        <p className="text-sm text-zinc-300">{item.description}</p>
      </div>
    </button>
  );
}
