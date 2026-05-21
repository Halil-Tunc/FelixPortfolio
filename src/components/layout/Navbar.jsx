import { Menu, X } from "lucide-react";
import { BRAND } from "../../data/brand";

const LINKS = [
  ["home", "Home"],
  ["gallery", "Gallery"],
  ["about", "About"],
  ["permissions", "Sources + Permissions"],
  ["contact", "Contact"],
];

export default function Navbar({ page, navigate, menuOpen, setMenuOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate("home")} className="text-left">
          <div className="text-lg font-semibold tracking-tight">
            {BRAND.name}
          </div>
          <div className="text-xs text-zinc-400">{BRAND.tagline}</div>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {LINKS.map(([value, label]) => (
            <button
              key={value}
              onClick={() => navigate(value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                page === value
                  ? "bg-white text-black"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-full border border-white/10 p-2 md:hidden"
          aria-label="Open menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-zinc-950 md:hidden">
          <div className="space-y-2 px-4 py-4">
            {LINKS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => navigate(value)}
                className={`block w-full rounded-2xl px-4 py-3 text-left text-sm ${
                  page === value
                    ? "bg-white text-black"
                    : "bg-white/5 text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
