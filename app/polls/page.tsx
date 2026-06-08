import Link from "next/link";
import PollsList from "../polls-list";
import { getPollsPage } from "@/lib/polls";

// Render on every request so freshly created polls show up.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function PollsPage() {
  const { polls, hasMore } = await getPollsPage(0, PAGE_SIZE);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
      <header className="mb-7">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Live now
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Polls</h1>
        <p className="mt-1.5 text-sm text-muted">
          Create a poll and watch the results roll in. One vote per person.
        </p>
        <nav className="mt-4 flex gap-2 text-sm">
          <Link
            href="/"
            className="rounded-lg border bg-surface px-3 py-1.5 font-medium text-muted transition-colors hover:border-brand hover:text-brand"
          >
            Q&amp;A
          </Link>
          <span className="rounded-lg bg-brand px-3 py-1.5 font-medium text-white">
            Polls
          </span>
        </nav>
      </header>
      <PollsList initialPolls={polls} initialHasMore={hasMore} />
    </main>
  );
}
