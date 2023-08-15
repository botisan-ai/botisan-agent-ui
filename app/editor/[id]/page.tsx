import { ChatEditor } from '@/components/editor/chat-editor'
import { getMessagesFromConvo } from '@/app/actions';

// export const runtime = 'edge'

export interface EditorPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: 'Editor'
};

export default async function IndexPage({ params }: EditorPageProps) {
  const { id } = params;

  const messages = await getMessagesFromConvo(id);

  console.log(messages);

  return <ChatEditor id={params.id} initialMessages={messages} />
}
