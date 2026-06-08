'use client'

import { ChevronUp, CheckCircle2, Pin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Question, timeAgo } from '@/lib/event-data'

export function QuestionCard({
  question,
  voted,
  onVote,
}: {
  question: Question
  voted: boolean
  onVote: (id: string) => void
}) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border bg-card p-4 transition-colors',
        question.pinned ? 'border-primary/40 bg-accent/40' : 'border-border',
      )}
    >
      <button
        type="button"
        onClick={() => onVote(question.id)}
        aria-pressed={voted}
        aria-label={`Upvote. ${question.votes} votes`}
        className={cn(
          'flex h-fit shrink-0 flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5 transition-all active:scale-90',
          voted
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background text-foreground hover:border-primary/60 hover:text-primary',
        )}
      >
        <ChevronUp
          className={cn('size-4 transition-transform', voted && '-translate-y-px')}
        />
        <span className="text-sm font-semibold tabular-nums">
          {question.votes}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {question.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
              <Pin className="size-3" />
              Pinned
            </span>
          )}
          {question.status === 'answered' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="size-3" />
              Answered
            </span>
          )}
        </div>
        <p className="text-pretty text-sm leading-relaxed text-foreground">
          {question.text}
        </p>
        {question.answer && (
          <div className="mt-3 rounded-lg border border-success/30 bg-success/10 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-success">
              <CheckCircle2 className="size-3.5" />
              Host answer
            </div>
            <p className="text-pretty text-sm leading-relaxed text-foreground">
              {question.answer}
            </p>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">
            {question.anonymous ? 'Anonymous' : question.author}
          </span>
          <span aria-hidden>•</span>
          <span>{timeAgo(question.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
