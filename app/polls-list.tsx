"use client";

import { useState, useEffect } from "react";
import { getVoterId } from "@/lib/voter";

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  author: string | null;
  totalVotes: number;
  options: PollOption[];
};

const VOTED_KEY = "poll_voted";

function getVotedMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(VOTED_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function rememberVote(pollId: string, optionId: string) {
  const map = getVotedMap();
  map[pollId] = optionId;
  localStorage.setItem(VOTED_KEY, JSON.stringify(map));
}

export default function PollsList({
  initialPolls,
  initialHasMore,
}: {
  initialPolls: Poll[];
  initialHasMore: boolean;
}) {
  const [polls, setPolls] = useState(initialPolls);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // which option this voter chose per poll (drives the results reveal)
  const [voted, setVoted] = useState<Record<string, string>>({});
  useEffect(() => setVoted(getVotedMap()), []);

  // ── create poll form state ──────────────────────────────────────────────
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  function updateOption(i: number, value: string) {
    setOptions((opts) => opts.map((o, idx) => (idx === i ? value : o)));
  }
  function addOption() {
    setOptions((opts) => (opts.length >= 6 ? opts : [...opts, ""]));
  }
  function removeOption(i: number) {
    setOptions((opts) => (opts.length <= 2 ? opts : opts.filter((_, idx) => idx !== i)));
  }

  async function createPoll() {
    const clean = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || clean.length < 2) {
      setError("Add a question and at least two options.");
      return;
    }
    setError(null);

    const res = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options: clean }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create poll.");
      return;
    }

    const created: Poll = await res.json();
    setPolls((p) => [created, ...p]);
    setQuestion("");
    setOptions(["", ""]);
    setCreating(false);
  }

  async function vote(pollId: string, optionId: string) {
    if (voted[pollId]) return; // already answered

    // optimistic: record the choice + bump the count now
    setVoted((v) => ({ ...v, [pollId]: optionId }));
    rememberVote(pollId, optionId);
    setPolls((ps) =>
      ps.map((p) =>
        p.id === pollId
          ? {
              ...p,
              totalVotes: p.totalVotes + 1,
              options: p.options.map((o) =>
                o.id === optionId ? { ...o, votes: o.votes + 1 } : o
              ),
            }
          : p
      )
    );

    const res = await fetch(`/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId: getVoterId(), optionId }),
    });

    // server rejected it for a reason other than "already voted" — roll back
    if (!res.ok && res.status !== 409) {
      setVoted((v) => {
        const next = { ...v };
        delete next[pollId];
        localStorage.setItem(VOTED_KEY, JSON.stringify(next));
        return next;
      });
      setPolls((ps) =>
        ps.map((p) =>
          p.id === pollId
            ? {
                ...p,
                totalVotes: p.totalVotes - 1,
                options: p.options.map((o) =>
                  o.id === optionId ? { ...o, votes: o.votes - 1 } : o
                ),
              }
            : p
        )
      );
    }
  }

  async function loadMore() {
    setLoading(true);
    const res = await fetch(`/api/polls?offset=${polls.length}`);
    const data = await res.json();
    setPolls((p) => [...p, ...data.polls]);
    setHasMore(data.hasMore);
    setLoading(false);
  }

  return (
    <div className="space-y-5">
      {/* Create poll */}
      <div className="rounded-2xl border bg-surface p-4 shadow-sm">
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-2.5 text-sm font-medium text-muted transition-colors hover:border-brand hover:text-brand"
          >
            <span className="text-base leading-none">+</span>
            Create a poll
          </button>
        ) : (
          <div className="space-y-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to ask?"
              autoFocus
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm font-medium outline-none placeholder:text-muted placeholder:font-normal focus:border-brand"
            />

            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand tabular-nums">
                    {i + 1}
                  </span>
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 rounded-xl border bg-background px-4 py-2 text-sm outline-none placeholder:text-muted focus:border-brand"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(i)}
                      aria-label={`Remove option ${i + 1}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-muted transition-colors hover:border-brand hover:text-brand"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button
                onClick={addOption}
                className="text-sm font-medium text-brand transition-opacity hover:opacity-80"
              >
                + Add option
              </button>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setCreating(false);
                  setError(null);
                  setQuestion("");
                  setOptions(["", ""]);
                }}
                className="rounded-xl border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
              >
                Cancel
              </button>
              <button
                onClick={createPoll}
                className="rounded-xl bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
              >
                Publish poll
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Polls */}
      <ul className="space-y-3">
        {polls.map((poll) => {
          const chosen = voted[poll.id];
          const revealed = Boolean(chosen);
          return (
            <li
              key={poll.id}
              className="rounded-2xl border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3.5 flex items-start justify-between gap-3">
                <h3 className="text-pretty font-medium leading-snug">
                  {poll.question}
                </h3>
                <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand tabular-nums">
                  {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
                </span>
              </div>

              <div className="space-y-2">
                {poll.options.map((opt) => {
                  const pct =
                    poll.totalVotes > 0
                      ? Math.round((opt.votes / poll.totalVotes) * 100)
                      : 0;
                  const isChoice = chosen === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => vote(poll.id, opt.id)}
                      disabled={revealed}
                      className={`group relative w-full overflow-hidden rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                        revealed
                          ? isChoice
                            ? "border-brand"
                            : "border-border"
                          : "hover:border-brand hover:bg-brand-soft"
                      } ${revealed ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {/* result fill bar */}
                      {revealed && (
                        <span
                          aria-hidden
                          className={`absolute inset-y-0 left-0 transition-[width] duration-500 ease-out ${
                            isChoice ? "bg-brand-soft" : "bg-background"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      )}
                      <span className="relative flex items-center justify-between gap-3">
                        <span
                          className={`flex items-center gap-2 ${
                            isChoice ? "font-medium text-brand" : ""
                          }`}
                        >
                          {isChoice && (
                            <span className="text-xs leading-none">✓</span>
                          )}
                          {opt.label}
                        </span>
                        {revealed && (
                          <span className="shrink-0 text-xs font-semibold tabular-nums text-muted">
                            {pct}%
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-muted">
                {poll.author ? `${poll.author} · ` : ""}
                {revealed ? "You voted" : "Tap an option to vote"}
              </p>
            </li>
          );
        })}
      </ul>

      {polls.length === 0 && (
        <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted">
          No polls yet — create the first one.
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-xl border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
