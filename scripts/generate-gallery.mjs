import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "generatedGallery.js");
const METADATA_FILE = path.join(IMAGES_DIR, "photo-data.json");

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

function toWebPath(filePath) {
  const relativeToPublic = path.relative(PUBLIC_DIR, filePath);
  return `/${relativeToPublic.split(path.sep).join("/")}`;
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
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function detectRole(baseName) {
  const parts = baseName.split(/[-_\s]+/);
  const lastPart = parts[parts.length - 1]?.toLowerCase();

  if (BEFORE_WORDS.includes(lastPart)) {
    return {
      role: "before",
      cleanBase: parts.slice(0, -1).join("-") || baseName,
    };
  }

  if (AFTER_WORDS.includes(lastPart)) {
    return {
      role: "after",
      cleanBase: parts.slice(0, -1).join("-") || baseName,
    };
  }

  return {
    role: "single",
    cleanBase: baseName,
  };
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readMetadata() {
  if (!(await exists(METADATA_FILE))) {
    return {};
  }

  try {
    const raw = await fs.readFile(METADATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Could not read public/images/photo-data.json.");
    console.warn(error.message);
    return {};
  }
}

async function walkDirectory(directory) {
  if (!(await exists(directory))) {
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
      const childFiles = await walkDirectory(fullPath);
      files.push(...childFiles);
    } else {
      const ext = path.extname(entry.name).toLowerCase();

      if (IMAGE_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function getCategoryFromFile(filePath) {
  const relativeToImages = path.relative(IMAGES_DIR, filePath);
  const parts = relativeToImages.split(path.sep);

  if (parts.length <= 1) {
    return {
      category: "Uncategorized",
      categorySlug: "uncategorized",
    };
  }

  const folderName = parts[0];

  return {
    category: humanize(folderName),
    categorySlug: slugify(folderName),
  };
}

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

function makeItem({ group, metadata, fallbackImage, index }) {
  const hasBeforeAfter = Boolean(group.before && group.after);
  const image = hasBeforeAfter ? group.after.webPath : fallbackImage.webPath;

  const peoplePhoto = Boolean(metadata.peoplePhoto);

  const item = {
    id: `${group.categorySlug}-${group.baseSlug}-${index}`,
    title: metadata.title || humanize(group.cleanBase),
    category: metadata.category || group.category,
    image,
    alt: metadata.alt || `${humanize(group.cleanBase)} photography`,
    description:
      metadata.description ||
      "Add a description for this photo in public/images/photo-data.json.",
    location: metadata.location || "Location not added",
    year: metadata.year || new Date().getFullYear().toString(),
    featured: Boolean(metadata.featured),
    peoplePhoto,
    source: {
      ...defaultSource(),
      ...(metadata.source || {}),
    },
    permission: {
      ...defaultPermission(peoplePhoto),
      ...(metadata.permission || {}),
    },
  };

  if (hasBeforeAfter) {
    item.beforeAfter = {
      beforeImage: group.before.webPath,
      afterImage: group.after.webPath,
      beforeLabel: metadata.beforeLabel || "Original",
      afterLabel: metadata.afterLabel || "Edited",
    };
  }

  return item;
}

function createGeneratedFile(items, categories) {
  return `// This file is auto-generated by scripts/generate-gallery.mjs.
// Do not edit this file directly.
// Add images to public/images/ and run npm run generate-gallery.

export const AUTO_PHOTO_CATEGORIES = ${JSON.stringify(categories, null, 2)}

export const AUTO_GALLERY_ITEMS = ${JSON.stringify(items, null, 2)}
`;
}

async function main() {
  const metadata = await readMetadata();
  const imageFiles = await walkDirectory(IMAGES_DIR);

  const groups = new Map();
  const singles = [];

  for (const filePath of imageFiles) {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath, ext);
    const { role, cleanBase } = detectRole(fileName);
    const { category, categorySlug } = getCategoryFromFile(filePath);

    const baseSlug = slugify(cleanBase);
    const metadataKey = `${categorySlug}/${baseSlug}`;

    const imageData = {
      filePath,
      webPath: toWebPath(filePath),
      fileName,
      cleanBase,
      category,
      categorySlug,
      baseSlug,
      metadataKey,
    };

    if (role === "single") {
      singles.push(imageData);
      continue;
    }

    if (!groups.has(metadataKey)) {
      groups.set(metadataKey, {
        cleanBase,
        baseSlug,
        category,
        categorySlug,
        metadataKey,
        before: null,
        after: null,
      });
    }

    const group = groups.get(metadataKey);
    group[role] = imageData;
  }

  const items = [];
  let index = 1;

  for (const group of groups.values()) {
    const groupMetadata = metadata[group.metadataKey] || {};

    const fallbackImage = group.after || group.before;

    if (fallbackImage) {
      items.push(
        makeItem({
          group,
          metadata: groupMetadata,
          fallbackImage,
          index,
        })
      );
      index += 1;
    }
  }

  for (const single of singles) {
    const singleMetadata = metadata[single.metadataKey] || {};

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
        metadata: singleMetadata,
        fallbackImage: single,
        index,
      })
    );
    index += 1;
  }

  items.sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) return categoryCompare;
    return a.title.localeCompare(b.title);
  });

  const categories = Array.from(
    new Set(items.map((item) => item.category))
  ).sort();

  if (!items.some((item) => item.featured)) {
    items.slice(0, 4).forEach((item) => {
      item.featured = true;
    });
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(
    OUTPUT_FILE,
    createGeneratedFile(items, categories),
    "utf8"
  );

  console.log(`Generated ${items.length} gallery item(s).`);
  console.log(`Generated categories: ${categories.join(", ") || "None yet"}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
