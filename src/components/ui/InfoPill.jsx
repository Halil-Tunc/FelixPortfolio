export default function InfoPill({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-zinc-400">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
