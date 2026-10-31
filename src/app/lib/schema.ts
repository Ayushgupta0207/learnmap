import { z } from "zod";

// Only allow http(s) links
const httpUrl = z.string().refine((v) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}, "Must be a valid http(s) URL");

export const categories = [
  "web-development",
  "devops",
  "data",
  "ai-ml",
  "security",
  "databases",
  "mobile",
  "computer-science",
  "languages",
] as const;

const resourceSchema = z.object({
  title: z.string().min(2).max(120),
  url: httpUrl,
  type: z.enum(["video", "doc", "book", "course", "article"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  free: z.boolean(),
  why: z.string().min(10).max(300),
});

const topicSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  title: z.string().min(2).max(80),
  summary: z.string().min(10).max(300),
  after: z.array(z.string()).default([]),
  resources: z.array(resourceSchema).min(1),
});

export const roadmapSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
    title: z.string().min(2).max(80),
    description: z.string().min(50).max(160),
    category: z.enum(categories),
    kind: z.enum(["role", "skill", "beginner"]),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD"),
    intro: z.array(z.string().min(20)).min(1),
    faq: z
      .array(z.object({ question: z.string().min(5), answer: z.string().min(20) }))
      .default([]),
    topics: z.array(topicSchema).min(1),
  })
  .superRefine((r, ctx) => {
    const ids = new Set<string>();
    r.topics.forEach((t, i) => {
      if (ids.has(t.id)) {
        ctx.addIssue({ code: "custom", message: `Duplicate topic id "${t.id}"`, path: ["topics", i, "id"] });
      }
      ids.add(t.id);
    });
    r.topics.forEach((t, i) => {
      t.after.forEach((a) => {
        if (!ids.has(a)) {
          ctx.addIssue({ code: "custom", message: `Unknown topic "${a}" in "after"`, path: ["topics", i, "after"] });
        }
      });
    });
  });

export type Roadmap = z.infer<typeof roadmapSchema>;
export type Topic = Roadmap["topics"][number];