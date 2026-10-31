import Link from "next/link";
import { getAllRoadmaps } from "@/app/lib/roadmaps";

export default function Home() {
  const roadmaps = getAllRoadmaps();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-4xl font-bold">LearnMap</h1>
      <p className="mt-2 text-gray-500">
        Curated roadmaps and the best resources to learn any tech.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {roadmaps.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/roadmaps/${r.slug}`}
              className="block rounded-xl border p-5 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{r.title}</h2>
              <p className="text-sm text-gray-500">{r.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}