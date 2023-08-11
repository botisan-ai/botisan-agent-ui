'use client'

import { useState } from 'react'

import { Message } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ChatEditorList } from '@/components/editor/chat-editor-list'
import { ChatEditorPanel } from '@/components/editor/chat-editor-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'

export interface ChatEditorProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function ChatEditor({ id, initialMessages, className }: ChatEditorProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        <>
          <ChatEditorList messages={messages} setMessages={setMessages} />
          <ChatScrollAnchor trackVisibility={true} />
        </>
      </div>
      <ChatEditorPanel
        id={id}
        isLoading={false}
        messages={messages}
        setMessages={setMessages}
      />
    </>
  )
}
