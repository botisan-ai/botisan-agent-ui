import { nanoid } from '@/lib/utils'
import { ChatEditor } from '@/components/editor/chat-editor'

export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()

  return <ChatEditor id={id} />
}
