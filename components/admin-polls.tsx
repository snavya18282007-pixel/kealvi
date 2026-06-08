'use client'

import { Lock, Play, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Poll, pollTypeLabel } from '@/lib/event-data'

export function AdminPolls({
  polls,
  setPolls,
}: {
  polls: Poll[]
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>
}) {
  const activate = (id: string) =>
    setPolls((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, status: 'active' }
          : p.status === 'active'
            ? { ...p, status: 'closed' }
            : p,
      ),
    )

  const close = (id: string) =>
    setPolls((ps) =>
      ps.map((p) => (p.id === id ? { ...p, status: 'closed' } : p)),
    )

  return (
    <div className="flex flex-col gap-3">
      {polls.map((poll) => {
        const total = poll.options.reduce((s, o) => s + o.votes, 0) || 1
        const isActive = poll.status === 'active'
        return (
          <div
            key={poll.id}
            className={cn(
              'rounded-xl border bg-card p-4',
              isActive ? 'border-success/50 ring-1 ring-success/30' : 'border-border',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                    {pollTypeLabel(poll.type)}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                      <Radio className="size-3" />
                      Live now
                    </span>
                  )}
                  {poll.status === 'closed' && (
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Closed
                    </span>
                  )}
                </div>
                <h3 className="text-pretty text-sm font-semibold text-foreground">
                  {poll.question}
                </h3>
              </div>
              {isActive ? (
                <Button size="sm" variant="outline" onClick={() => close(poll.id)}>
                  <Lock className="size-3.5" />
                  Close
                </Button>
              ) : (
                <Button size="sm" onClick={() => activate(poll.id)}>
                  <Play className="size-3.5" />
                  Launch
                </Button>
              )}
            </div>

            {(isActive || poll.status === 'closed') && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                {poll.options.map((o) => {
                  const pct = Math.round((o.votes / total) * 100)
                  return (
                    <div key={o.id}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-foreground">{o.label}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-[width] duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                <p className="mt-1 text-xs text-muted-foreground">
                  {poll.totalResponses} responses
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
