import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRoadmaps, getRoadmap } from "@/app/lib/roadmaps";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRoadmaps().map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) return {};
  return {
    title: `${roadmap.title} Roadmap`,
    description: roadmap.description,
  };
}

export default async function RoadmapPage({ params }: Props) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm underline">← All roadmaps</Link>

      <h1 className="mt-4 text-3xl font-bold">{roadmap.title} Roadmap</h1>
      <p className="mt-2 text-gray-500">{roadmap.description}</p>

      {roadmap.intro.map((p, i) => (
        <p key={i} className="mt-4">{p}</p>
      ))}

      <h2 className="mt-10 text-2xl font-semibold">Topics to learn</h2>
      <ol className="mt-4 space-y-8">
        {roadmap.topics.map((t) => (
          <li key={t.id}>
            <h3 className="text-xl font-semibold">{t.title}</h3>
            <p className="text-gray-500">{t.summary}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {t.resources.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {r.title}
                  </a>{" "}
                  ({r.type}, {r.level}, {r.free ? "free" : "paid"}): {r.why}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {roadmap.faq.length > 0 && (
        <>
          <h2 className="mt-10 text-2xl font-semibold">Frequently asked questions</h2>
          <dl className="mt-4 space-y-4">
            {roadmap.faq.map((f) => (
              <div key={f.question}>
                <dt className="font-semibold">{f.question}</dt>
                <dd className="text-gray-500">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </main>
  );
}