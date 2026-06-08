'use client'

import { MessageSquarePlus, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { QuestionCard } from '@/components/question-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { type Question } from '@/lib/event-data'

const MAX_CHARS = 280
type SortKey = 'top' | 'recent'

export function QaTab({
  questions,
  setQuestions,
}: {
  questions: Question[]
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
}) {
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [sort, setSort] = useState<SortKey>('top')
  const [voted, setVoted] = useState<Record<string, boolean>>({})

  const visible = useMemo(() => {
    const list = questions.filter((q) => q.status !== 'archived')
    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return sort === 'top' ? b.votes - a.votes : b.createdAt - a.createdAt
    })
  }, [questions, sort])

  const handleVote = (id: string) => {
    const isVoted = voted[id]
    setVoted((v) => ({ ...v, [id]: !isVoted }))
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id ? { ...q, votes: q.votes + (isVoted ? -1 : 1) } : q,
      ),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const newQ: Question = {
      id: `q-${Date.now()}`,
      text: text.trim(),
      author: anonymous ? 'Anonymous' : 'You',
      anonymous,
      votes: 1,
      status: 'open',
      pinned: false,
      createdAt: Date.now(),
    }
    setQuestions((qs) => [newQ, ...qs])
    setVoted((v) => ({ ...v, [newQ.id]: true }))
    setText('')
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-4 shadow-sm"
      >
        <Textarea
          value={text}
          maxLength={MAX_CHARS}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask the speaker a question..."
          className="min-h-20 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
        />
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Switch checked={anonymous} onCheckedChange={setAnonymous} />
            Ask anonymously
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-muted-foreground">
              {text.length}/{MAX_CHARS}
            </span>
            <Button type="submit" size="sm" disabled={!text.trim()}>
              <Send className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          {visible.length} questions
        </h2>
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          {(['top', 'recent'] as SortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                sort === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              voted={!!voted[q.id]}
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-accent">
        <MessageSquarePlus className="size-5 text-primary" />
      </div>
      <p className="text-sm font-medium text-foreground">No questions yet</p>
      <p className="text-pretty text-sm text-muted-foreground">
        Be the first to ask the speaker something.
      </p>
    </div>
  )
}
