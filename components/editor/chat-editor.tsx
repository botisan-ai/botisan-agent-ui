'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { Message } from '@/lib/types'
import { cn, nanoid } from '@/lib/utils'
import { ChatEditorList } from '@/components/editor/chat-editor-list'
import { ChatEditorPanel } from '@/components/editor/chat-editor-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { saveMessagesIntoConvo } from '@/app/actions'

export interface ChatEditorProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function ChatEditor({
  id,
  initialMessages,
  className
}: ChatEditorProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])

  async function saveConversation(functionsEnabled = false, functions?: any) {
    if (messages.filter(item => item.isEdit).length > 0) {
      toast.error(`There is a message not saved`)
      return
    }

    if (functionsEnabled && !functions) {
      toast.error(`No functions provided with functions enabled`)
      return
    }

    console.log(id)

    if (!id) {
      const newId = nanoid()
      await saveMessagesIntoConvo(newId, messages, functions)
      router.push(`/editor/${newId}`)
    }

    await saveMessagesIntoConvo(id!, messages, functions)
    router.push(`/editor/${id}`)

    toast.success('save success')
  }

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
        messages={messages}
        setMessages={setMessages}
        saveConversation={saveConversation}
      />
    </>
  )
}
