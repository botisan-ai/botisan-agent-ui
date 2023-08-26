import { nanoid } from '@/lib/utils'
import { ChatEditor } from '@/components/editor/chat-editor'

// export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()

  return (
    <ChatEditor
      id={id}
      initialMessages={[
        {
          role: 'system',
          content:
            'You are a helpful chatbot. You are helping a customer with a problem.'
        }
      ]}
    />
  )
}
