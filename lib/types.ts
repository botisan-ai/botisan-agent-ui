export interface Message {
  role: 'user' | 'assistant' | 'function' | 'system'
  name?: string
  content: string
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>