// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { useState, Dispatch, SetStateAction } from 'react'

import { Message } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ChatEditorMessageView } from '@/components/editor/chat-editor-message-view'
import { ChatEditorMessageEdit } from '@/components/editor/chat-editor-message-edit'

export interface ChatEditorMessageProps {
  message: Message;
  setMessage: (param: Message) => void;
  insertMessage: (type: string) => void;
  cancelInsert: () => void;
}

export function ChatEditorMessage({
  message,
  setMessage,
  insertMessage,
  cancelInsert,
  ...props
}: ChatEditorMessageProps) {
  const [isEditing, setIsEditing] = useState(false);

  function saveMessage(value: Message) {
    console.log(message);
    setMessage(value);
  }

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      {
        message.isEdit || isEditing ? (
          <ChatEditorMessageEdit message={message} saveMessage={saveMessage} setIsEditing={setIsEditing} cancelInsert={cancelInsert} />
        ) : (
          <ChatEditorMessageView message={message} setIsEditing={setIsEditing} insertMessage={insertMessage} />
        )
      }
    </div>
  )
}
