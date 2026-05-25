import { GALLERY_ITEMS } from "../data/gallery";
import Panel from "../components/ui/Panel";
import SectionHeader from "../components/ui/SectionHeader";

const PLACEHOLDER_STATUSES = new Set([
  "Permission not marked yet",
  "Not marked",
  "Add permission proof",
]);

function isPlaceholderProof(url) {
  return !url || url === "#";
}

export default function PermissionsPage({ setSelectedItem }) {
  const permissionItems = GALLERY_ITEMS.filter((item) => item.peoplePhoto);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Sources + permissions"
        title="Permission and source records for photography featuring people."
        text="For photos of people, this page provides a clear record of permission and attribution."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {permissionItems.map((item) => {
          const hasProof = !isPlaceholderProof(item.permission.proofUrl);
          const isPlaceholderStatus = PLACEHOLDER_STATUSES.has(
            item.permission.status
          );
          const displayStatus = isPlaceholderStatus
            ? "Pending documentation"
            : item.permission.status;

          return (
            <Panel key={item.id} className="space-y-4">
              <img
                src={item.thumbnail || item.image}
                alt={item.alt}
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      hasProof
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {displayStatus}
                  </span>
                </div>
                <p className="text-sm text-zinc-300">
                  {item.permission.publicNote &&
                  !item.permission.publicNote.includes("photo-data.json")
                    ? item.permission.publicNote
                    : "Permission documentation in progress."}
                </p>
              </div>

              <div className="grid gap-2 text-sm text-zinc-300">
                <div>
                  <span className="font-medium text-white">Source:</span>{" "}
                  {item.source.label}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  View image details
                </button>

                {hasProof && (
                  <a
                    href={item.permission.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                  >
                    {item.permission.proofLabel}
                  </a>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
