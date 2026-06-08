export type QuestionStatus = "open" | "answered" | "archived"

export type Question = {
  id: string
  text: string
  author: string
  anonymous: boolean
  votes: number
  status: QuestionStatus
  pinned: boolean
  createdAt: number
  answer?: string
  votedByMe?: boolean
}

export type PollType = "multiple-choice" | "word-cloud" | "rating"
export type PollStatus = "draft" | "active" | "closed"

export type PollOption = {
  id: string
  label: string
  votes: number
}

export type Poll = {
  id: string
  question: string
  type: PollType
  status: PollStatus
  options: PollOption[]
  totalResponses: number
  votedOptionId?: string | null
}

export type EventInfo = {
  id: string
  code: string
  title: string
  participants: number
  createdAt: number
}

export function pollTypeLabel(type: PollType) {
  switch (type) {
    case "multiple-choice":
      return "Multiple Choice"
    case "word-cloud":
      return "Word Cloud"
    case "rating":
      return "Rating"
  }
}

export function timeAgo(ts: number) {
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
