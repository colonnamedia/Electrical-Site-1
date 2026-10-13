import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

console.log(`Built ${rootFiles.length} root files and shared assets into dist/.`);
