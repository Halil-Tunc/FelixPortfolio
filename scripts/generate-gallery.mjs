import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const GENERATED_DIR = path.join(PUBLIC_DIR, "generated");
const GENERATED_IMAGES_DIR = path.join(GENERATED_DIR, "images");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "generatedGallery.js");
const METADATA_FILE = path.join(IMAGES_DIR, "photo-data.json");
const DUPLICATE_REPORT_FILE = path.join(GENERATED_DIR, "duplicate-report.json");

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

const BEFORE_WORDS = ["original", "orig", "before", "unedited", "raw"];
const AFTER_WORDS = ["edited", "edit", "after", "final", "modified"];

const KEYWORD_TAG_MAP = [
  {
    tag: "Automotive",
    keywords: ["car", "cars", "honda", "toyota", "tesla", "truck", "vehicle", "auto"],
  },
  {
    tag: "Portrait",
    keywords: ["portrait", "person", "people", "senior", "headshot", "model"],
  },
  {
    tag: "Black & White",
    keywords: ["black-white", "blackandwhite", "bw", "monochrome"],
  },
  {
    tag: "Nature",
    keywords: ["nature", "tree", "trees", "flower", "sky", "sunset"],
  },
  {
    tag: "Landscape",
    keywords: ["landscape", "panorama", "scenery", "scenic"],
  },
  {
    tag: "Event",
    keywords: ["event", "wedding", "party", "concert", "performance"],
  },
  { tag: "Product", keywords: ["product", "brand", "commercial"] },
  { tag: "Street", keywords: ["street", "city", "urban"] },
  { tag: "Macro", keywords: ["macro", "closeup", "close-up"] },
];

// ── Pure utilities ─────────────────────────────────────────────────────────

function toWebPath(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  return `/${rel.split(path.sep).join("/")}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanize(text) {
  return text
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function detectRole(baseName) {
  const parts = baseName.split(/[-_\s]+/);
  const last = parts[parts.length - 1]?.toLowerCase();
  if (BEFORE_WORDS.includes(last)) {
    return { role: "before", cleanBase: parts.slice(0, -1).join("-") || baseName };
  }
  if (AFTER_WORDS.includes(last)) {
    return { role: "after", cleanBase: parts.slice(0, -1).join("-") || baseName };
  }
  return { role: "single", cleanBase: baseName };
}

function normalizeTags(tags) {
  const seen = new Set();
  const result = [];
  for (const tag of tags) {
    if (!tag) continue;
    const key = tag.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(tag.trim());
  }
  return result;
}

function getAutoTagsFromFilename(fileName) {
  const lower = fileName.toLowerCase();
  const tags = [];
  for (const { tag, keywords } of KEYWORD_TAG_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) {
      tags.push(tag);
    }
  }
  return tags;
}

function getOrientationTag(width, height) {
  if (!width || !height) return null;
  if (width > height) return "Landscape Orientation";
  if (height > width) return "Portrait Orientation";
  return "Square";
}

function buildAutoTags({ categories, fileName, width, height, isBlackAndWhite }) {
  const tags = [];
  for (const cat of categories) tags.push(cat);
  tags.push(...getAutoTagsFromFilename(fileName));
  const orientation = getOrientationTag(width, height);
  if (orientation) tags.push(orientation);
  if (isBlackAndWhite) tags.push("Black & White");
  return normalizeTags(tags);
}

function pickCanonical(group, allMetadata) {
  function score(imageData) {
    const meta = allMetadata[imageData.metadataKey] || {};
    const fieldCount = Object.values(meta).filter(
      (v) => v !== undefined && v !== null && v !== ""
    ).length;
    return fieldCount * 1000 - imageData.fileName.length;
  }
  return group.reduce((best, cur) => {
    const bs = score(best);
    const cs = score(cur);
    if (cs > bs) return cur;
    if (cs === bs) return cur.fileName < best.fileName ? cur : best;
    return best;
  });
}

function buildMergedMetadata(group, canonical, allMetadata) {
  const base = { ...(allMetadata[canonical.metadataKey] || {}) };
  for (const imageData of group) {
    if (imageData.filePath === canonical.filePath) continue;
    const meta = allMetadata[imageData.metadataKey] || {};
    if (meta.featured) base.featured = true;
    if (Array.isArray(meta.tags)) {
      const existing = Array.isArray(base.tags) ? base.tags : [];
      base.tags = normalizeTags([...existing, ...meta.tags]);
    }
  }
  return base;
}

// ── I/O helpers ────────────────────────────────────────────────────────────

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isNewer(source, target) {
  try {
    const [s, t] = await Promise.all([fs.stat(source), fs.stat(target)]);
    return s.mtimeMs > t.mtimeMs;
  } catch {
    return true;
  }
}

async function readMetadata() {
  if (!(await fileExists(METADATA_FILE))) return {};
  try {
    return JSON.parse(await fs.readFile(METADATA_FILE, "utf8"));
  } catch (err) {
    console.warn("Could not read public/images/photo-data.json:", err.message);
    return {};
  }
}

async function walkDirectory(directory) {
  if (!(await fileExists(directory))) {
    await fs.mkdir(directory, { recursive: true });
    return [];
  }
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "photo-data.json") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(fullPath)));
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function getCategoryFromFile(filePath) {
  const rel = path.relative(IMAGES_DIR, filePath);
  const parts = rel.split(path.sep);
  if (parts.length <= 1) return { category: "Uncategorized", categorySlug: "uncategorized" };
  // "source" is a storage folder, not a display category — let metadata supply the category
  if (parts[0].toLowerCase() === "source") return { category: null, categorySlug: "source" };
  return {
    category: humanize(parts[0]),
    categorySlug: slugify(parts[0]),
  };
}

async function analyzeImage(filePath) {
  try {
    const [meta, pixelBuffer, stats] = await Promise.all([
      sharp(filePath).metadata(),
      sharp(filePath).resize(32, 32, { fit: "fill" }).greyscale().raw().toBuffer(),
      sharp(filePath).resize({ width: 64 }).removeAlpha().stats(),
    ]);

    const hash = crypto.createHash("sha256").update(pixelBuffer).digest("hex");

    let isBlackAndWhite = false;
    const ch = stats.channels;
    if (ch.length === 1) {
      isBlackAndWhite = true;
    } else if (ch.length >= 3) {
      const maxDiff = Math.max(
        Math.abs(ch[0].mean - ch[1].mean),
        Math.abs(ch[0].mean - ch[2].mean),
        Math.abs(ch[1].mean - ch[2].mean)
      );
      isBlackAndWhite = maxDiff < 15;
    }

    return { hash, width: meta.width, height: meta.height, isBlackAndWhite };
  } catch (err) {
    console.warn(`  Warning: could not analyze ${path.basename(filePath)}: ${err.message}`);
    return { hash: filePath, width: 0, height: 0, isBlackAndWhite: false };
  }
}

async function generateVariants(sourceFilePath) {
  const relToImages = path.relative(IMAGES_DIR, sourceFilePath);
  const ext = path.extname(relToImages);
  const baseName = path.basename(relToImages, ext);
  const dir = path.dirname(relToImages);

  const outDir = path.join(GENERATED_IMAGES_DIR, dir);
  await fs.mkdir(outDir, { recursive: true });

  const previewPath = path.join(outDir, `${baseName}_preview.webp`);
  const thumbPath = path.join(outDir, `${baseName}_thumb.webp`);
  const fullPath = path.join(outDir, `${baseName}_full.webp`);

  const [needsPreview, needsThumb, needsFull] = await Promise.all([
    isNewer(sourceFilePath, previewPath),
    isNewer(sourceFilePath, thumbPath),
    isNewer(sourceFilePath, fullPath),
  ]);

  if (needsPreview || needsThumb || needsFull) {
    const tasks = [];
    if (needsPreview) {
      tasks.push(
        sharp(sourceFilePath)
          .resize({ width: 40, withoutEnlargement: true })
          .webp({ quality: 20 })
          .toFile(previewPath)
      );
    }
    if (needsThumb) {
      tasks.push(
        sharp(sourceFilePath)
          .resize({ width: 700, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(thumbPath)
      );
    }
    if (needsFull) {
      tasks.push(
        sharp(sourceFilePath)
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(fullPath)
      );
    }
    await Promise.all(tasks);
    console.log(`  Generated: ${baseName}`);
  }

  return {
    preview: toWebPath(previewPath),
    thumbnail: toWebPath(thumbPath),
    image: toWebPath(fullPath),
    originalImage: toWebPath(sourceFilePath),
  };
}

// ── Item builder ───────────────────────────────────────────────────────────

function defaultSource() {
  return {
    label: "Original photo by photographer",
    url: "#",
    note: "Add source details in public/images/photo-data.json if needed.",
  };
}

function defaultPermission(peoplePhoto) {
  if (peoplePhoto) {
    return {
      status: "Permission not marked yet",
      publicNote:
        "Add permission details and a proof link in public/images/photo-data.json.",
      proofLabel: "Add permission proof",
      proofUrl: "#",
    };
  }
  return {
    status: "Not marked",
    publicNote:
      "No permission proof has been added. If this photo contains a person, update public/images/photo-data.json.",
    proofLabel: "Usage note",
    proofUrl: "#",
  };
}

function makeItem({
  group,
  canonical,
  duplicateCount,
  allCategories,
  metadata,
  fallbackVariants,
  index,
}) {
  const hasBeforeAfter = Boolean(group.before && group.after);
  const variants = hasBeforeAfter ? group.after.variants : fallbackVariants;
  const peoplePhoto = Boolean(metadata.peoplePhoto);

  const autoTags = buildAutoTags({
    categories: allCategories,
    fileName: canonical.fileName,
    width: canonical.analysis?.width,
    height: canonical.analysis?.height,
    isBlackAndWhite: canonical.analysis?.isBlackAndWhite,
  });

  const manualTags = normalizeTags(
    Array.isArray(metadata.tags) ? metadata.tags : []
  );
  const tags = normalizeTags([...autoTags, ...manualTags]);

  const item = {
    id: `${group.categorySlug}-${group.baseSlug}-${index}`,
    title: metadata.title || humanize(group.cleanBase),
    category: metadata.category || group.category || "Uncategorized",
    tags,
    autoTags,
    manualTags,
    image: variants.image,
    thumbnail: variants.thumbnail,
    preview: variants.preview,
    originalImage: variants.originalImage,
    alt: metadata.alt || `${humanize(group.cleanBase)} photography`,
    description:
      metadata.description ||
      "Add a description for this photo in public/images/photo-data.json.",
    location: metadata.location || "Location not added",
    year: metadata.year || new Date().getFullYear().toString(),
    featured: Boolean(metadata.featured),
    peoplePhoto,
    source: { ...defaultSource(), ...(metadata.source || {}) },
    permission: {
      ...defaultPermission(peoplePhoto),
      ...(metadata.permission || {}),
    },
  };

  if (duplicateCount > 1) {
    item.duplicateCount = duplicateCount;
  }

  if (hasBeforeAfter) {
    item.beforeAfter = {
      beforeImage: group.before.variants.image,
      beforePreview: group.before.variants.preview,
      afterImage: group.after.variants.image,
      afterPreview: group.after.variants.preview,
      beforeLabel: metadata.beforeLabel || "Original",
      afterLabel: metadata.afterLabel || "Edited",
    };
  }

  return item;
}

function createGeneratedFile(items, categories, tags) {
  return `// This file is auto-generated by scripts/generate-gallery.mjs.
// Do not edit this file directly.
// Add images to public/images/ and run npm run generate-gallery.

export const AUTO_PHOTO_CATEGORIES = ${JSON.stringify(categories, null, 2)}

export const AUTO_PHOTO_TAGS = ${JSON.stringify(tags, null, 2)}

export const AUTO_GALLERY_ITEMS = ${JSON.stringify(items, null, 2)}
`;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const metadata = await readMetadata();

  // Only scan public/images — never public/generated
  const imageFiles = await walkDirectory(IMAGES_DIR);

  // Build lightweight image-data objects from file paths
  const allImageData = imageFiles.map((filePath) => {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath, ext);
    const { role, cleanBase } = detectRole(fileName);
    const { category, categorySlug } = getCategoryFromFile(filePath);
    const baseSlug = slugify(cleanBase);
    const metadataKey = `${categorySlug}/${baseSlug}`;
    return {
      filePath,
      fileName,
      cleanBase,
      role,
      category,
      categorySlug,
      baseSlug,
      metadataKey,
      analysis: null,
      variants: null,
    };
  });

  // Analyze each image: hash (for dup detection) + dims + B&W flag
  console.log(`Analyzing ${allImageData.length} image(s)...`);
  for (const imageData of allImageData) {
    imageData.analysis = await analyzeImage(imageData.filePath);
  }

  // Group by perceptual hash
  const hashGroups = new Map();
  for (const imageData of allImageData) {
    const { hash } = imageData.analysis;
    if (!hashGroups.has(hash)) hashGroups.set(hash, []);
    hashGroups.get(hash).push(imageData);
  }

  // Pick canonical file for every hash group; collect skipped entries
  const canonicalSet = new Set();
  const canonicalToGroup = new Map();
  const skippedEntries = [];

  for (const [hash, group] of hashGroups) {
    const canonical = pickCanonical(group, metadata);
    canonicalSet.add(canonical.filePath);
    canonicalToGroup.set(canonical.filePath, group);

    if (group.length > 1) {
      for (const imageData of group) {
        if (imageData.filePath === canonical.filePath) continue;
        const skippedRel = path.relative(IMAGES_DIR, imageData.filePath);
        const keptRel = path.relative(IMAGES_DIR, canonical.filePath);
        console.log(`  Duplicate: ${skippedRel}  →  keeping ${keptRel}`);
        skippedEntries.push({
          skipped: toWebPath(imageData.filePath),
          keptAs: toWebPath(canonical.filePath),
          hash,
          reason: "Visually identical content (pixel hash match)",
        });
      }
    }
  }

  // Keep only canonical files, then apply before/after grouping
  const canonicals = allImageData.filter((d) => canonicalSet.has(d.filePath));

  const beforeAfterGroups = new Map();
  const singles = [];

  for (const imageData of canonicals) {
    if (imageData.role === "single") {
      singles.push(imageData);
      continue;
    }
    if (!beforeAfterGroups.has(imageData.metadataKey)) {
      beforeAfterGroups.set(imageData.metadataKey, {
        cleanBase: imageData.cleanBase,
        baseSlug: imageData.baseSlug,
        category: imageData.category,
        categorySlug: imageData.categorySlug,
        metadataKey: imageData.metadataKey,
        before: null,
        after: null,
      });
    }
    const group = beforeAfterGroups.get(imageData.metadataKey);
    group[imageData.role] = imageData;
  }

  // Generate WebP variants for canonical files only
  console.log("Generating image variants...");

  for (const single of singles) {
    single.variants = await generateVariants(single.filePath);
  }
  for (const group of beforeAfterGroups.values()) {
    if (group.before) {
      group.before.variants = await generateVariants(group.before.filePath);
    }
    if (group.after) {
      group.after.variants = await generateVariants(group.after.filePath);
    }
  }

  // Build gallery items
  const items = [];
  let index = 1;

  for (const group of beforeAfterGroups.values()) {
    const fallback = group.after || group.before;
    if (!fallback) continue;

    const dupGroup = canonicalToGroup.get(fallback.filePath) || [fallback];
    const mergedMeta = buildMergedMetadata(dupGroup, fallback, metadata);
    const allCategories = [...new Set(dupGroup.map((d) => d.category))];

    items.push(
      makeItem({
        group,
        canonical: fallback,
        duplicateCount: dupGroup.length,
        allCategories,
        metadata: mergedMeta,
        fallbackVariants: fallback.variants,
        index,
      })
    );
    index++;
  }

  for (const single of singles) {
    const dupGroup = canonicalToGroup.get(single.filePath) || [single];
    const mergedMeta = buildMergedMetadata(dupGroup, single, metadata);
    const allCategories = [...new Set(dupGroup.map((d) => d.category))];

    items.push(
      makeItem({
        group: {
          cleanBase: single.cleanBase,
          baseSlug: single.baseSlug,
          category: single.category,
          categorySlug: single.categorySlug,
          metadataKey: single.metadataKey,
          before: null,
          after: null,
        },
        canonical: single,
        duplicateCount: dupGroup.length,
        allCategories,
        metadata: mergedMeta,
        fallbackVariants: single.variants,
        index,
      })
    );
    index++;
  }

  items.sort((a, b) => {
    const cat = a.category.localeCompare(b.category);
    return cat !== 0 ? cat : a.title.localeCompare(b.title);
  });

  const categories = [...new Set(items.map((i) => i.category))].sort();
  const allTags = [...new Set(items.flatMap((i) => i.tags))].sort();

  if (!items.some((i) => i.featured)) {
    items.slice(0, 4).forEach((i) => { i.featured = true; });
  }

  // Write generatedGallery.js
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(
    OUTPUT_FILE,
    createGeneratedFile(items, categories, allTags),
    "utf8"
  );

  // Write duplicate report
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  await fs.writeFile(
    DUPLICATE_REPORT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalSourceImages: allImageData.length,
        uniqueImages: items.length,
        duplicatesSkipped: skippedEntries.length,
        skippedFiles: skippedEntries,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `\nGenerated ${items.length} item(s) from ${allImageData.length} source image(s).`
  );
  if (skippedEntries.length > 0) {
    console.log(
      `Skipped ${skippedEntries.length} duplicate(s). See public/generated/duplicate-report.json`
    );
  }
  console.log(`Categories: ${categories.join(", ") || "none"}`);
  console.log(`Tags: ${allTags.join(", ") || "none"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
