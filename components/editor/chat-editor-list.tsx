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

  function setMessage(value: Message, index: number) {
    setMessages([...messages.slice(0, index), value, ...messages.slice(index + 1)])
  }

  function insertMessage(type: string, index: number) {
    if (type === 'before') {
      setMessages([...messages.slice(0, index), { role: 'user', content: '', isEdit: true }, ...messages.slice(index)])
    }
    if (type === 'after') {
      setMessages([...messages.slice(0, index + 1), { role: 'user', content: '', isEdit: true }, ...messages.slice(index + 1)])
    }
  }

  function deleteMessage(index: number) {
    setMessages([...messages.slice(0, index), ...messages.slice(index + 1)])
  }

  function cancelInsert() {
    setMessages([...messages.filter(item => !item.isEdit)])
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatEditorMessage
            message={message}
            setMessage={(value) => setMessage(value, index)}
            insertMessage={(value) => insertMessage(value, index)}
            deleteMessage={() => deleteMessage(index)}
            cancelInsert={cancelInsert}
          />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-11" />
          )}
        </div>
      ))}
    </div>
  )
}
