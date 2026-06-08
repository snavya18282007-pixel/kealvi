'use client'

import {
  BarChart3,
  Eye,
  MessageSquare,
  Radio,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AdminPolls } from '@/components/admin-polls'
import { AdminQa } from '@/components/admin-qa'
import { KelviLogo } from '@/components/kelvi-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DEMO_EVENT,
  INITIAL_POLLS,
  INITIAL_QUESTIONS,
  type Poll,
  type Question,
} from '@/lib/event-data'

type Section = 'qa' | 'polls'

export function AdminDashboard() {
  const [section, setSection] = useState<Section>('qa')
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS)

  const openCount = questions.filter((q) => q.status === 'open').length
  const livePoll = polls.find((p) => p.status === 'active')

  const nav: { key: Section; label: string; icon: typeof MessageSquare; badge?: number }[] = [
    { key: 'qa', label: 'Q&A', icon: MessageSquare, badge: openCount },
    { key: 'polls', label: 'Polls', icon: BarChart3 },
  ]

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="px-2">
          <KelviLogo />
        </div>

        <div className="mt-6 rounded-xl border border-sidebar-border bg-card p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Active event
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {DEMO_EVENT.title}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono text-primary">#{DEMO_EVENT.code}</span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {DEMO_EVENT.participants}
            </span>
          </div>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon
            const active = section === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSection(item.key)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <Button
            render={<Link href="/event" />}
            variant="outline"
            size="sm"
            className="justify-start"
          >
            <Eye className="size-4" />
            Participant view
          </Button>
          <button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Settings className="size-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {section === 'qa' ? 'Q&A Management' : 'Poll Management'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {section === 'qa'
                ? 'Moderate, pin, and answer audience questions.'
                : 'Launch and control live polls.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {livePoll && (
              <span className="hidden items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-medium text-success sm:flex">
                <Radio className="size-3" />
                Poll live
              </span>
            )}
            <ThemeToggle />
            <Button
              render={<Link href="/event" />}
              variant="outline"
              size="sm"
              className="md:hidden"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="flex gap-1 border-b border-border bg-card px-4 py-2 md:hidden">
          {nav.map((item) => {
            const Icon = item.icon
            const active = section === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSection(item.key)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground',
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </div>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 md:px-6">
          {section === 'qa' ? (
            <AdminQa questions={questions} setQuestions={setQuestions} />
          ) : (
            <AdminPolls polls={polls} setPolls={setPolls} />
          )}
        </main>
      </div>
    </div>
  )
}
