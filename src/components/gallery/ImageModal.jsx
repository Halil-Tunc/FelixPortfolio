import {
  ExternalLink,
  MapPin,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import InfoPill from "../ui/InfoPill";
import BeforeAfterSlider from "./BeforeAfterSlider";

function normalizeLocation(location) {
  if (!location || location === "Location not added" || location === "Undisclosed") {
    return "Undisclosed";
  }
  return location;
}

function isPlaceholderText(text) {
  return !text || text.includes("photo-data.json") || text.includes("Add ");
}

function normalizePermissionStatus(status) {
  if (!status || status === "Permission not marked yet") return "Pending";
  if (status === "Not marked") return "Not required";
  return status;
}

export default function ImageModal({ item, close }) {
  const hasBeforeAfter = Boolean(item.beforeAfter?.afterImage);
  const displayLocation = normalizeLocation(item.location);
  const hasSourceLink = item.source?.url && item.source.url !== "#";
  const hasProofLink = item.permission?.proofUrl && item.permission.proofUrl !== "#";
  const permissionStatus = normalizePermissionStatus(item.permission?.status);
  const showSourceNote = !isPlaceholderText(item.source?.note);
  const showPermissionNote = !isPlaceholderText(item.permission?.publicNote);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
        className="grid max-h-[92vh] w-full max-w-6xl gap-4 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="relative overflow-y-auto bg-black p-4">
          {hasBeforeAfter ? (
            <BeforeAfterSlider
              beforeImage={item.beforeAfter.beforeImage || item.image}
              afterImage={item.beforeAfter.afterImage}
              beforeLabel={item.beforeAfter.beforeLabel || "Original"}
              afterLabel={item.beforeAfter.afterLabel || "Edited"}
              alt={item.alt}
            />
          ) : (
            <img
              src={item.image}
              alt={item.alt}
              className="h-full w-full rounded-3xl object-cover"
            />
          )}

          <button
            onClick={close}
            className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/50 p-2 backdrop-blur"
            aria-label="Close image details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                  {item.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                  {item.year}
                </span>

                {hasBeforeAfter && (
                  <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
                    Original + edited comparison
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-semibold">{item.title}</h2>
              {item.description && (
                <p className="text-zinc-300">{item.description}</p>
              )}
            </div>

            <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
              <InfoPill
                icon={<MapPin className="h-4 w-4" />}
                text={displayLocation}
              />

              {item.peoplePhoto ? (
                <InfoPill
                  icon={<UserRound className="h-4 w-4" />}
                  text="Portrait subject"
                />
              ) : (
                <InfoPill
                  icon={<UserRound className="h-4 w-4" />}
                  text="No personal release required"
                />
              )}

              <InfoPill
                icon={<ShieldCheck className="h-4 w-4" />}
                text={permissionStatus}
              />
            </div>

            {hasBeforeAfter && (
              <div className="rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5">
                <h3 className="text-lg font-semibold text-sky-100">
                  Editing comparison
                </h3>
                <div className="mt-4 space-y-2 text-sm text-sky-50/90">
                  <p>
                    <span className="font-medium text-white">Original:</span>{" "}
                    {item.beforeAfter.beforeLabel || "Original photo"}
                  </p>
                  <p>
                    <span className="font-medium text-white">Edited:</span>{" "}
                    {item.beforeAfter.afterLabel || "Edited photo"}
                  </p>
                  <p>
                    Use the slider on the image to compare the original and
                    modified versions.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Source details</h3>
              <div className="mt-4 space-y-2 text-sm text-zinc-300">
                <p>
                  <span className="font-medium text-white">Source:</span>{" "}
                  {item.source.label}
                </p>
                {showSourceNote && (
                  <p>
                    <span className="font-medium text-white">Note:</span>{" "}
                    {item.source.note}
                  </p>
                )}
                {hasSourceLink && (
                  <a
                    href={item.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-white underline underline-offset-4"
                  >
                    Open source link
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <h3 className="text-lg font-semibold text-emerald-100">
                Permission details
              </h3>
              <div className="mt-4 space-y-2 text-sm text-emerald-50/90">
                <p>
                  <span className="font-medium text-white">Status:</span>{" "}
                  {permissionStatus}
                </p>
                {showPermissionNote && (
                  <p>
                    <span className="font-medium text-white">Note:</span>{" "}
                    {item.permission.publicNote}
                  </p>
                )}
                {hasProofLink && (
                  <a
                    href={item.permission.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-white underline underline-offset-4"
                  >
                    {item.permission.proofLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
