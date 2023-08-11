import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Chat } from '@/components/chat'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  return {
    title: 'Chat',
    // title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = null

  if (!chat) {
    notFound()
  }

  return <Chat id={'1'} initialMessages={[]} />
}
