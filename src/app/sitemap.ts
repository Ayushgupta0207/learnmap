import type { MetadataRoute } from "next";
import { getAllRoadmaps } from "@/app/lib/roadmaps";
import { SITE_URL } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...getAllRoadmaps().map((r) => ({
      url: `${SITE_URL}/roadmaps/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}