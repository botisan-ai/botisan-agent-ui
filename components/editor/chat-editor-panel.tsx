'use client'

import { Dispatch, SetStateAction, useState } from 'react'

import { Message } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { EditorForm } from './editor-form'
import { cn } from '@/lib/utils'

export interface ChatEditorPanelProps {
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>
  isLoading: boolean
  id?: string
  saveConversation: () => void
}

export function ChatEditorPanel({
  isLoading,
  messages,
  setMessages,
  saveConversation,
}: ChatEditorPanelProps) {
  const [messageType, setMessageType] = useState('user')
  const [input, setInput] = useState('')

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <EditorForm
            onSubmit={async (value, messageType) => {
              setMessages((messages: Message[]) => {
                return [
                  ...messages,
                  {
                    role: messageType,
                    content: value,
                  } as Message
                ]
              })
            }}
            messageType={messageType}
            setMessageType={setMessageType}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <div className={cn("flex flex-row space-x-4")}>
            <Button onClick={saveConversation}>Save Conversation</Button>
            <Button variant="outline" onClick={() => setMessages([])}>Reset</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
