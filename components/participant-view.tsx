'use client'

import { BarChart3, MessageSquare, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PollsTab } from '@/components/polls-tab'
import { QaTab } from '@/components/qa-tab'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DEMO_EVENT,
  INITIAL_POLLS,
  INITIAL_QUESTIONS,
  type Poll,
  type Question,
} from '@/lib/event-data'

export function ParticipantView() {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS)

  const activePoll = polls.find((p) => p.status === 'active')

  const handlePollVote = (pollId: string, optionId: string) => {
    setPolls((ps) =>
      ps.map((p) =>
        p.id === pollId
          ? {
              ...p,
              totalResponses: p.totalResponses + 1,
              options: p.options.map((o) =>
                o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
              ),
            }
          : p,
      ),
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <Link
              href="/"
              className="text-[11px] font-medium uppercase tracking-wide text-primary"
            >
              #{DEMO_EVENT.code}
            </Link>
            <h1 className="truncate text-base font-semibold text-foreground">
              {DEMO_EVENT.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
              <Users className="size-3.5 text-muted-foreground" />
              {DEMO_EVENT.participants}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Tabs defaultValue="qa" className="flex flex-1 flex-col">
        <div className="sticky top-[57px] z-10 border-b border-border bg-background/85 px-4 py-2 backdrop-blur">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qa">
              <MessageSquare className="size-4" />
              Q&amp;A
            </TabsTrigger>
            <TabsTrigger value="polls">
              <BarChart3 className="size-4" />
              Polls
              {activePoll && (
                <span className="ml-0.5 size-1.5 rounded-full bg-success" />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 px-4 py-4">
          <TabsContent value="qa" className="mt-0">
            <QaTab questions={questions} setQuestions={setQuestions} />
          </TabsContent>
          <TabsContent value="polls" className="mt-0">
            <PollsTab poll={activePoll} onVote={handlePollVote} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
