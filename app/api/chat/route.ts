import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

// import { nanoid } from '@/lib/utils'

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, functions, function_call } = json

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0,
      functions,
      function_call
    })
    return NextResponse.json(res)
  } catch (error: any) {
    return NextResponse.json({ error: error.error.message.join('\n') }, { status: error.status })
  }
}
