import { Dispatch, SetStateAction } from 'react'

import { Message } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import { ChatEditorMessage } from '@/components/editor/chat-editor-message'

export interface ChatEditorListProps {
  id?: string
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>
}

export function ChatEditorList({ messages, setMessages }: ChatEditorListProps) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatEditorMessage message={message} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
