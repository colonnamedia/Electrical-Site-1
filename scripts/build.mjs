import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages, origin } from "./routes.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist");

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const rootFiles = (await readdir(projectRoot)).filter((name) =>
  /\.(html|xml|txt|svg|webmanifest)$/.test(name),
);

await Promise.all(
  rootFiles.map((name) => cp(path.join(projectRoot, name), path.join(outputRoot, name))),
);
await cp(path.join(projectRoot, "assets"), path.join(outputRoot, "assets"), { recursive: true });

const { writeFile } = await import("node:fs/promises");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${origin}${page === "index.html" ? "/" : `/${page.replace(/\.html$/, "")}`}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(path.join(projectRoot, "sitemap.xml"), sitemap);
await writeFile(path.join(outputRoot, "sitemap.xml"), sitemap);

console.log(`Built ${rootFiles.length} root files and shared assets into dist/.`);
