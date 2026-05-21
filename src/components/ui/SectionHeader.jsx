export default function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl space-y-3">
      <div className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="text-zinc-300">{text}</p>
    </div>
  );
}
