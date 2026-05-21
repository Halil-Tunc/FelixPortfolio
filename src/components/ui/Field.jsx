export default function Field({ label, children }) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-zinc-200">{label}</span>
      {children}
    </label>
  );
}
