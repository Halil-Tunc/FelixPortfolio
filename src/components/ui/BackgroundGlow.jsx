export default function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[-8rem] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-[18rem] w-[18rem] rounded-full bg-white/5 blur-3xl" />
    </div>
  );
}
