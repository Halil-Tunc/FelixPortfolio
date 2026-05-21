import { useState } from "react";

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original",
  afterLabel = "Edited",
  alt = "Before and after photography comparison",
}) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
        <img
          src={beforeImage}
          alt={`${alt} - ${beforeLabel}`}
          className="block aspect-[4/5] w-full object-cover"
          draggable="false"
        />

        <img
          src={afterImage}
          alt={`${alt} - ${afterLabel}`}
          className="absolute inset-0 block h-full w-full object-cover"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
          draggable="false"
        />

        <div
          className="absolute inset-y-0 z-10 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.55)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/70 text-xs font-semibold text-white backdrop-blur">
            ↔
          </div>
        </div>

        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
          {afterLabel}
        </div>

        <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
          {beforeLabel}
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(event) => setSliderPosition(Number(event.target.value))}
        aria-label="Slide to compare original and edited photo"
        className="w-full cursor-ew-resize accent-white"
      />

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{afterLabel}</span>
        <span>Drag slider</span>
        <span>{beforeLabel}</span>
      </div>
    </div>
  );
}
