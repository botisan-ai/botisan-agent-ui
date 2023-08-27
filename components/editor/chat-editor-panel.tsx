'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-hot-toast'
import Editor from '@monaco-editor/react'
import { ChevronUp, ChevronDown } from 'lucide-react'

import { Message } from '@/lib/types'
import { cn, fetcher } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'

export interface ChatEditorPanelProps {
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>
  id?: string
  saveConversation: (functionsEnabled?: boolean, functions?: any) => void
}

export function ChatEditorPanel({
  messages,
  setMessages,
  saveConversation
}: ChatEditorPanelProps) {
  const [messageType, setMessageType] = useState('user')
  const [useFunctionCall, setUseFunctionCall] = useState(false)
  const [showFunctionCallSetting, setShowFunctionCallSetting] = useState(false)
  const [editorMarkers, setEditorMarkers] = useState<any[]>([])
  const [functionCallSetting, setFunctionCallSetting] = useState({
    functions: [],
    function_call: 'none'
  })

  async function sendToOpenAI() {
    const toastId = toast.loading('Requesting to OpenAI...')

    try {
      const res = await fetcher('/api/chat', {
        method: 'POST',
        body: JSON.stringify(
          useFunctionCall
            ? {
                messages,
                ...functionCallSetting
              }
            : {
                messages
              }
        )
      })

      toast.dismiss(toastId)

      const newMessage = res.choices[0].message

      setMessages([...messages, newMessage])

      toast.success('Received response')
    } catch (err: any) {
      toast.dismiss(toastId)
      toast.error(`OpenAI Request Error: ${err.message}`)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          {showFunctionCallSetting && (
            <Editor
              height="300px"
              theme="vs-dark"
              defaultLanguage="json"
              options={{
                tabSize: 2,
                insertSpaces: true,
                minimap: {
                  enabled: false
                },
                fontSize: 14,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                scrollbar: {
                  alwaysConsumeMouseWheel: false
                }
              }}
              defaultPath="function-call-setting.json"
              defaultValue={JSON.stringify(functionCallSetting, null, 2)}
              onMount={(editor, monaco) => {
                monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                  validate: true,
                  schemaValidation: 'error',
                  schemas: [
                    {
                      uri: 'https://dummy.json.schema/function-call',
                      fileMatch: ['function-call-setting.json'],
                      schema: {
                        type: 'object',
                        properties: {
                          functions: {
                            type: 'array'
                          },
                          function_call: {
                            type: 'string'
                          }
                        }
                      }
                    }
                  ]
                })
              }}
              onValidate={setEditorMarkers}
              onChange={(value, ev) =>
                setFunctionCallSetting(JSON.parse(value!))
              }
            />
          )}
          <div className={cn('flex flex-row items-center justify-between')}>
            <Button
              onClick={() =>
                saveConversation(useFunctionCall, functionCallSetting.functions)
              }
            >
              Save Conversation
            </Button>
            <Button variant="secondary" onClick={sendToOpenAI}>
              Send to OpenAI
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setMessages([
                  {
                    role: 'system',
                    content: 'Clean slate :)'
                  }
                ])
              }
            >
              Reset
            </Button>
            <div className="flex flex-row items-center space-x-2">
              <Switch
                checked={useFunctionCall}
                onCheckedChange={value => setUseFunctionCall(value)}
                name="use-function-call"
              ></Switch>
              <Label htmlFor="use-function-call">Use Function Call</Label>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setShowFunctionCallSetting(
                  showFunctionCallSetting => !showFunctionCallSetting
                )
              }
            >
              {showFunctionCallSetting ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
