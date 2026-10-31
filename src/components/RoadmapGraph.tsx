"use client";

import { useMemo, useState } from "react";
import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Topic } from "@/app/lib/schema";

type Props = {
  topics: Topic[];
  positions: Record<string, { x: number; y: number }>;
};

export default function RoadmapGraph({ topics, positions }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = topics.find((t) => t.id === activeId) ?? null;

  const nodes: Node[] = useMemo(
    () =>
      topics.map((t) => ({
        id: t.id,
        position: positions[t.id],
        data: { label: t.title },
        style: {
          width: 180,
          padding: "10px 12px",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 14,
          textAlign: "center" as const,
          cursor: "pointer",
          border: t.id === activeId ? "2px solid #6366f1" : undefined,
        },
      })),
    [topics, positions, activeId]
  );

  const edges: Edge[] = useMemo(
    () =>
      topics.flatMap((t) =>
        t.after.map((a) => ({ id: `${a}-${t.id}`, source: a, target: t.id }))
      ),
    [topics]
  );

  return (
    <section className="mt-8 hidden md:block">
      <div className="h-[520px] w-full rounded-xl border border-gray-500/40">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          onNodeClick={(_, node) => setActiveId(node.id)}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="mt-4 rounded-xl border border-gray-500/40 p-4">
        {active ? (
          <>
            <h3 className="text-xl font-semibold">{active.title}</h3>
            <p className="mb-3 text-gray-500">{active.summary}</p>
            <ul className="space-y-2">
              {active.resources.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                    {r.title}
                  </a>{" "}
                  <span className="text-sm text-gray-500">
                    ({r.type}, {r.level}, {r.free ? "free" : "paid"})
                  </span>
                  <p className="text-sm">{r.why}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-500">Click a topic to see its best resources.</p>
        )}
      </div>
    </section>
  );
}