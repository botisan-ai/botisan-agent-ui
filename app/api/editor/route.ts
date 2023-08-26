import { saveMessagesIntoConvo } from '@/app/actions';

export async function POST(req: Request) {
  const json = await req.json()
  const { id, messages } = json

  await saveMessagesIntoConvo(id, messages);
  return new Response(true);
}
