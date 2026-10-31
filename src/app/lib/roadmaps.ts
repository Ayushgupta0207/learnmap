import fs from "node:fs";
import path from "node:path";
import { roadmapSchema, type Roadmap } from "./schema";

const dir = path.join(process.cwd(), "content", "roadmaps");

export function getAllRoadmaps(): Roadmap[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  return files
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const parsed = roadmapSchema.safeParse(raw);

      if (!parsed.success) {
        const problems = parsed.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n");
        throw new Error(`Invalid roadmap file "${file}":\n${problems}`);
      }
      if (parsed.data.slug !== file.replace(".json", "")) {
        throw new Error(`File "${file}": the slug must match the file name`);
      }
      return parsed.data;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getRoadmap(slug: string): Roadmap | undefined {
  return getAllRoadmaps().find((r) => r.slug === slug);
}