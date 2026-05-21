export default function Panel({ children, className = "" }) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
