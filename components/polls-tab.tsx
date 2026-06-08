'use client'

import { BarChart3, Check, Lock } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Poll, pollTypeLabel } from '@/lib/event-data'

export function PollsTab({
  poll,
  onVote,
}: {
  poll: Poll | undefined
  onVote: (pollId: string, optionId: string) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!poll || poll.status !== 'active') {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-accent">
          <BarChart3 className="size-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">No active poll</p>
        <p className="text-pretty text-sm text-muted-foreground">
          When the host launches a poll, it will appear here instantly.
        </p>
      </div>
    )
  }

  const total = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1

  const handleSubmit = () => {
    if (!selected) return
    onVote(poll.id, selected)
    setSubmitted(true)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        Live · {pollTypeLabel(poll.type)}
      </span>

      <h2 className="mt-3 text-balance text-lg font-semibold text-foreground">
        {poll.question}
      </h2>

      <div className="mt-5 flex flex-col gap-2.5">
        {poll.options.map((opt) => {
          const pct = Math.round((opt.votes / total) * 100)
          const isSelected = selected === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              disabled={submitted}
              onClick={() => setSelected(opt.id)}
              className={cn(
                'relative overflow-hidden rounded-xl border px-4 py-3 text-left transition-all',
                submitted
                  ? 'cursor-default border-border'
                  : isSelected
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/50',
              )}
            >
              {submitted && (
                <div
                  className="absolute inset-y-0 left-0 bg-primary/15 transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
              )}
              <div className="relative flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {!submitted && (
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full border',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/40',
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                  )}
                  {opt.label}
                </span>
                {submitted && (
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {submitted ? (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Check className="size-4 text-success" />
          Vote submitted · {total} responses
        </p>
      ) : (
        <Button
          className="mt-5 w-full"
          size="lg"
          disabled={!selected}
          onClick={handleSubmit}
        >
          Submit vote
        </Button>
      )}

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Your response is private
      </p>
    </div>
  )
}
