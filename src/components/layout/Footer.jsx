import { BRAND } from "../../data/brand";

export default function Footer({ navigate }) {
  const pages = ["home", "gallery", "about", "permissions", "contact"];

  return (
    <footer className="border-t border-white/10 bg-zinc-950/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div className="space-y-3">
          <div className="text-lg font-semibold">{BRAND.name}</div>
          <p className="max-w-xl text-sm text-zinc-400">{BRAND.tagline}</p>
          <p className="text-sm text-zinc-500">{BRAND.city}</p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {pages.map((pageName) => (
            <button
              key={pageName}
              onClick={() => navigate(pageName)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm capitalize text-zinc-200 transition hover:bg-white/10"
            >
              {pageName === "permissions" ? "Sources + permissions" : pageName}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
