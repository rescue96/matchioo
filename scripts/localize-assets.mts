import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const root = process.cwd();
const runtimeDir = join(root, "public", "assets", "framer");
const imageDir = join(root, "public", "assets", "img");
const imageUrlPattern = /https:\/\/framerusercontent\.com\/images\/[^"'`\s\\]+/g;
const imagePathPattern = /https:\/\/framerusercontent\.com\/images\/([^?"'`\s\\]+)/g;

const files = [
  join(root, "src", "manifest.json"),
  ...(await readdir(runtimeDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mjs"))
    .map((entry) => join(runtimeDir, entry.name)),
];

const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
const urls = new Set(contents.flatMap((content) => content.match(imageUrlPattern) ?? []));
const images = new Map<string, string>();

await mkdir(imageDir, { recursive: true });

for (const url of urls) {
  const parsed = new URL(url);
  const filename = basename(parsed.pathname);
  const localPath = join(imageDir, filename);
  const localUrl = `/assets/img/${filename}`;
  images.set(parsed.pathname, localUrl);

  try {
    await readFile(localPath);
  } catch {
    const response = await fetch(`${parsed.origin}${parsed.pathname}`);
    if (!response.ok) {
      throw new Error(`Unable to download ${url}: ${response.status} ${response.statusText}`);
    }
    await writeFile(localPath, Buffer.from(await response.arrayBuffer()));
    console.log(`downloaded ${filename}`);
  }
}

for (const [index, content] of contents.entries()) {
  const localized = content.replace(imagePathPattern, (match, filename: string) => {
    const localUrl = images.get(`/images/${filename}`);
    return localUrl ?? match;
  });
  if (localized !== content) await writeFile(files[index], localized);
}

console.log(`localized ${images.size} image(s) across ${files.length} file(s)`);