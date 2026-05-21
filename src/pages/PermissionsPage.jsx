import { GALLERY_ITEMS } from "../data/gallery";
import Panel from "../components/ui/Panel";
import SectionHeader from "../components/ui/SectionHeader";

export default function PermissionsPage({ setSelectedItem }) {
  const permissionItems = GALLERY_ITEMS.filter((item) => item.peoplePhoto);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Sources + permissions"
        title="A public-facing record that helps you show your process clearly."
        text="For photos of people, this page gives you a simple way to show that you had permission to use the image."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {permissionItems.map((item) => (
          <Panel key={item.id} className="space-y-4">
            <img
              src={item.image}
              alt={item.alt}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  {item.permission.status}
                </span>
              </div>
              <p className="text-sm text-zinc-300">
                {item.permission.publicNote}
              </p>
            </div>

            <div className="grid gap-2 text-sm text-zinc-300">
              <div>
                <span className="font-medium text-white">Source:</span>{" "}
                {item.source.label}
              </div>
              <div>
                <span className="font-medium text-white">Note:</span>{" "}
                {item.source.note}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedItem(item)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
              >
                Open image details
              </button>

              <a
                href={item.permission.proofUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
              >
                {item.permission.proofLabel}
              </a>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
