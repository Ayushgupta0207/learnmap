import type { Topic } from "./schema";

const NODE_W = 180;
const GAP_X = 40;
const ROW_H = 140;

export function computeLayout(topics: Topic[]): Record<string, { x: number; y: number }> {
  const byId = new Map(topics.map((t) => [t.id, t]));
  const depth = new Map<string, number>();
  const visiting = new Set<string>();

  // A topic's row = one below its deepest prerequisite
  function getDepth(id: string): number {
    const known = depth.get(id);
    if (known !== undefined) return known;
    if (visiting.has(id)) {
      throw new Error(`Topics form a loop around "${id}". Check the "after" lists.`);
    }
    visiting.add(id);
    const topic = byId.get(id)!;
    const d = topic.after.length === 0 ? 0 : 1 + Math.max(...topic.after.map(getDepth));
    visiting.delete(id);
    depth.set(id, d);
    return d;
  }

  const rows = new Map<number, string[]>();
  for (const t of topics) {
    const d = getDepth(t.id);
    rows.set(d, [...(rows.get(d) ?? []), t.id]);
  }

  const positions: Record<string, { x: number; y: number }> = {};
  rows.forEach((ids, d) => {
    const total = ids.length * NODE_W + (ids.length - 1) * GAP_X;
    ids.forEach((id, i) => {
      positions[id] = { x: -total / 2 + i * (NODE_W + GAP_X), y: d * ROW_H };
    });
  });
  return positions;
}