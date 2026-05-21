import GalleryCard from "./GalleryCard";
import Panel from "../ui/Panel";

export default function GalleryGrid({ items, openItem }) {
  if (!items.length) {
    return (
      <Panel>
        <div className="text-center">
          <h3 className="text-xl font-semibold">
            No images match that search yet.
          </h3>
          <p className="mt-2 text-sm text-zinc-300">
            Try a different category or keyword.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} onClick={() => openItem(item)} />
      ))}
    </div>
  );
}
