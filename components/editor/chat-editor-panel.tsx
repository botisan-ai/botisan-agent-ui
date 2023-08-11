'use client'

import { Dispatch, SetStateAction, useState } from 'react'

import { Message } from '@/lib/types'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'

export interface ChatEditorPanelProps {
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>
  isLoading: boolean
  id?: string
}

export function ChatEditorPanel({
  isLoading,
  messages,
  setMessages,
}: ChatEditorPanelProps) {
  const [input, setInput] = useState('')

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              setMessages((messages: Message[]) => {
                return [
                  ...messages,
                  {
                    role: 'user',
                    content: value,
                  } as Message
                ]
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
