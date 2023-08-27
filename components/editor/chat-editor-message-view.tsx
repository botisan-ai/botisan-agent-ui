// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { useState } from 'react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { Message } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import {
  IconFunction,
  IconOpenAI,
  IconSystem,
  IconUser
} from '@/components/ui/icons'
import { ChatEditorMessageActions } from '@/components/editor/chat-editor-message-actions'

export interface ChatEditorMessageProps {
  message: Message;
  setIsEditing: (param: boolean) => void;
  insertMessage: (type: string) => void;
}

export function ChatEditorMessageView({
  message,
  setIsEditing,
  insertMessage,
}: ChatEditorMessageProps) {
  return (
    <>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? (
          <IconUser />
        ) : message.role === 'function' ? (
          <IconFunction />
        ) : message.role === 'system' ? (
          <IconSystem />
        ) : (
          <IconOpenAI />
        )}
      </div>
      <div className="ml-4 flex-1 justify-center overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.role === 'function'
            ? `Function return for \`${
                message.name
              }\`:\n\`\`\`json\n${JSON.stringify(
                JSON.parse(message.content),
                null,
                2
              )}\n\`\`\``
            : message.function_call
            ? `**Invoke function call:**\n\`\`\`json\n${JSON.stringify(
                {
                  name: message.function_call.name,
                  arguments: JSON.parse(message.function_call.arguments)
                },
                null,
                2
              )}\n\`\`\``
            : message.content}
        </MemoizedReactMarkdown>
        <ChatEditorMessageActions message={message} setIsEditing={setIsEditing} insertMessage={insertMessage} />
      </div>
    </>
  )
}
