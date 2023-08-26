'use client'

import { Message } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconEdit, IconNextChat } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message;
  setIsEditing: (param: any) => void;
  insertMessage: (type: string) => void;
}

export function ChatEditorMessageActions({
  message,
  className,
  setIsEditing,
  insertMessage,
  ...props
}: ChatMessageActionsProps) {
  return (
    <div
      className={cn(
        'flex md:flex-col items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-10 md:opacity-0',
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={() => insertMessage('before')}>
        <IconArrowElbow className="rotate-90 scale-y-100 md:rotate-0 md:-scale-y-100" />
        <span className="sr-only">Insert above</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
        <IconEdit />
        <span className="sr-only">Edit message</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => insertMessage('after')}>
        <IconArrowElbow className="-rotate-90 md:rotate-0" />
        <span className="sr-only">Insert below</span>
      </Button>
    </div>
  )
}
