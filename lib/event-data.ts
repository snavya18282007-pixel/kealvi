export type QuestionStatus = 'open' | 'answered' | 'archived'

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
}

export type PollType = 'multiple-choice' | 'word-cloud' | 'rating'
export type PollStatus = 'draft' | 'active' | 'closed'

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
}

export type EventInfo = {
  code: string
  title: string
  participants: number
}

export const DEMO_EVENT: EventInfo = {
  code: '849213',
  title: 'Q3 All-Hands: Product & Roadmap',
  participants: 248,
}

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'What are the biggest priorities for the platform team in the next quarter?',
    author: 'Priya Sharma',
    anonymous: false,
    votes: 47,
    status: 'open',
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 'q2',
    text: 'Will we be expanding the remote work policy to international hires?',
    author: 'Anonymous',
    anonymous: true,
    votes: 38,
    status: 'open',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 8,
  },
  {
    id: 'q3',
    text: 'How does the new pricing model affect our enterprise customers?',
    author: 'Marcus Lee',
    anonymous: false,
    votes: 21,
    status: 'answered',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 25,
    answer:
      'Enterprise customers keep their current rates through the end of their contract term, then move to the new model at renewal. The sales team will reach out individually with a tailored migration plan.',
  },
  {
    id: 'q4',
    text: 'Can we get more clarity on the hybrid office schedule for Q4?',
    author: 'Anonymous',
    anonymous: true,
    votes: 14,
    status: 'open',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 3,
  },
  {
    id: 'q5',
    text: 'Are there plans to invest more in developer tooling and CI speed?',
    author: 'Dana White',
    anonymous: false,
    votes: 9,
    status: 'open',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 1,
  },
]

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'p1',
    question: 'How are you feeling about this quarter overall?',
    type: 'rating',
    status: 'active',
    totalResponses: 182,
    options: [
      { id: 'o1', label: '5 — Excellent', votes: 64 },
      { id: 'o2', label: '4 — Good', votes: 71 },
      { id: 'o3', label: '3 — Okay', votes: 31 },
      { id: 'o4', label: '2 — Concerned', votes: 11 },
      { id: 'o5', label: '1 — Struggling', votes: 5 },
    ],
  },
  {
    id: 'p2',
    question: 'Which area should we prioritize next?',
    type: 'multiple-choice',
    status: 'draft',
    totalResponses: 0,
    options: [
      { id: 'o1', label: 'Performance & reliability', votes: 0 },
      { id: 'o2', label: 'New integrations', votes: 0 },
      { id: 'o3', label: 'Mobile experience', votes: 0 },
      { id: 'o4', label: 'Analytics & reporting', votes: 0 },
    ],
  },
  {
    id: 'p3',
    question: 'In one word, how would you describe our team culture?',
    type: 'word-cloud',
    status: 'draft',
    totalResponses: 0,
    options: [
      { id: 'o1', label: 'Collaborative', votes: 0 },
      { id: 'o2', label: 'Fast-paced', votes: 0 },
      { id: 'o3', label: 'Supportive', votes: 0 },
    ],
  },
]

export function pollTypeLabel(type: PollType) {
  switch (type) {
    case 'multiple-choice':
      return 'Multiple Choice'
    case 'word-cloud':
      return 'Word Cloud'
    case 'rating':
      return 'Rating'
  }
}

export function timeAgo(ts: number) {
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
