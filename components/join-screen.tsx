'use client'

import { ArrowRight, BarChart3, MessageSquare, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreateEventDialog } from '@/components/create-event-dialog'
import { KelviLogo } from '@/components/kelvi-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function JoinScreen() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [authOpen, setAuthOpen] = useState(false)

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/event')
  }

  return (
    <main className="relative flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4 md:px-8">
        <KelviLogo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => setAuthOpen(true)}>
            Sign in
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Live audience engagement, made simple
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Join the conversation in seconds
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Enter the event code shown on screen to ask questions, vote, and
            take part in live polls.
          </p>

          <form
            onSubmit={handleJoin}
            className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <label
              htmlFor="event-code"
              className="text-sm font-medium text-foreground"
            >
              Enter event code
            </label>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-semibold text-muted-foreground">
                #
              </span>
              <input
                id="event-code"
                inputMode="numeric"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="123456"
                className="w-full bg-transparent font-mono text-3xl font-semibold tracking-[0.2em] text-foreground outline-none placeholder:text-muted-foreground/40"
              />
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full">
              Join event
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Hosting an event?
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="mt-6 w-full"
            onClick={() => setAuthOpen(true)}
          >
            Create an event
          </Button>

          <div className="mt-10 grid grid-cols-2 gap-3">
            <Feature
              icon={<MessageSquare className="size-4 text-primary" />}
              title="Live Q&A"
              desc="Crowd-sourced questions, upvoted in real time."
            />
            <Feature
              icon={<BarChart3 className="size-4 text-primary" />}
              title="Instant polls"
              desc="Multiple choice, ratings, and word clouds."
            />
          </div>
        </div>
      </div>

      <CreateEventDialog open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </div>
  )
}
