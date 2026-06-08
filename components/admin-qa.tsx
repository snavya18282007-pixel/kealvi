'use client'

import {
  Archive,
  ChevronUp,
  CheckCircle2,
  Inbox,
  Pencil,
  Pin,
  Reply,
  RotateCcw,
  Send,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { type Question, timeAgo } from '@/lib/event-data'

type Filter = 'open' | 'answered' | 'archived'

export function AdminQa({
  questions,
  setQuestions,
}: {
  questions: Question[]
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
}) {
  const [filter, setFilter] = useState<Filter>('open')
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const openReply = (q: Question) => {
    setReplyingId(q.id)
    setDraft(q.answer ?? '')
  }

  const cancelReply = () => {
    setReplyingId(null)
    setDraft('')
  }

  const submitReply = (id: string) => {
    const text = draft.trim()
    if (!text) return
    update(id, { answer: text, status: 'answered' })
    cancelReply()
  }

  const counts = useMemo(
    () => ({
      open: questions.filter((q) => q.status === 'open').length,
      answered: questions.filter((q) => q.status === 'answered').length,
      archived: questions.filter((q) => q.status === 'archived').length,
    }),
    [questions],
  )

  const visible = useMemo(
    () =>
      [...questions]
        .filter((q) => q.status === filter)
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
          return b.votes - a.votes
        }),
    [questions, filter],
  )

  const update = (id: string, patch: Partial<Question>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const togglePin = (id: string) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id
          ? { ...q, pinned: !q.pinned }
          : { ...q, pinned: q.pinned && false },
      ),
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['open', 'answered', 'archived'] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-colors',
              filter === f
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
            <span
              className={cn(
                'rounded-full px-1.5 text-xs tabular-nums',
                filter === f
                  ? 'bg-primary-foreground/20'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-accent">
            <Inbox className="size-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Nothing here yet
          </p>
          <p className="text-sm text-muted-foreground">
            {filter} questions will show up in this list.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((q) => (
            <div
              key={q.id}
              className={cn(
                'rounded-xl border bg-card p-4',
                q.pinned ? 'border-primary/40 bg-accent/30' : 'border-border',
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center rounded-lg border border-border bg-background px-2.5 py-1.5">
                  <ChevronUp className="size-4 text-primary" />
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {q.votes}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-pretty text-sm leading-relaxed text-foreground">
                    {q.text}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {q.anonymous ? 'Anonymous' : q.author} · {timeAgo(q.createdAt)}
                  </p>
                </div>
              </div>

              {q.answer && replyingId !== q.id && (
                <div className="mt-3 rounded-lg border border-success/30 bg-success/10 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-success">
                    <CheckCircle2 className="size-3.5" />
                    Your answer
                  </div>
                  <p className="text-pretty text-sm leading-relaxed text-foreground">
                    {q.answer}
                  </p>
                </div>
              )}

              {replyingId === q.id && (
                <div className="mt-3 rounded-lg border border-border bg-background p-3">
                  <Textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your answer for participants to see..."
                    className="min-h-20 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                  />
                  <div className="mt-2 flex items-center justify-end gap-2 border-t border-border pt-2">
                    <Button size="sm" variant="ghost" onClick={cancelReply}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={!draft.trim()}
                      onClick={() => submitReply(q.id)}
                    >
                      <Send className="size-3.5" />
                      Post answer
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                {q.status !== 'archived' && (
                  <>
                    <Button
                      size="sm"
                      variant={replyingId === q.id ? 'default' : 'outline'}
                      onClick={() => openReply(q)}
                    >
                      {q.answer ? (
                        <>
                          <Pencil className="size-3.5" />
                          Edit answer
                        </>
                      ) : (
                        <>
                          <Reply className="size-3.5" />
                          Answer
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={q.pinned ? 'default' : 'outline'}
                      onClick={() => togglePin(q.id)}
                    >
                      <Pin className="size-3.5" />
                      {q.pinned ? 'Pinned' : 'Pin to screen'}
                    </Button>
                    {q.status !== 'answered' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => update(q.id, { status: 'answered' })}
                      >
                        <CheckCircle2 className="size-3.5" />
                        Mark answered
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        update(q.id, { status: 'archived', pinned: false })
                      }
                    >
                      <Archive className="size-3.5" />
                      Archive
                    </Button>
                  </>
                )}
                {q.status === 'archived' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => update(q.id, { status: 'open' })}
                  >
                    <RotateCcw className="size-3.5" />
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
