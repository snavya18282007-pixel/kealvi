import { cn } from '@/lib/utils'

export function KelviLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d="M4 4v16" />
          <path d="M4 12 14 4" />
          <path d="M9 8.5 20 20" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Kelvi
      </span>
    </div>
  )
}
