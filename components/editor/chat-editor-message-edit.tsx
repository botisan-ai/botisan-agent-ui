// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx
'use client'

import { useState } from 'react'

import Editor, { EditorProps, type Monaco } from '@monaco-editor/react'

import { Message } from '@/lib/types'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export interface ChatEditorMessageProps {
  message: Message
  setIsEditing: (param: any) => void
  saveMessage: (param: Message) => void
  cancelInsert: () => void
}

export function ChatEditorMessageEdit({
  message,
  setIsEditing,
  saveMessage,
  cancelInsert
}: ChatEditorMessageProps) {
  const [editRole, setEditRole] = useState<any>(message.role)
  const [editName, setEditName] = useState(message.name)
  const [editContent, setEditContent] = useState(message.content)
  const [editFunctionContent, setEditFunctionContent] = useState(
    message.role === 'function' ? JSON.parse(message.content) : {}
  )
  const [editWithFunctionCall, setWithFunctionCall] = useState(
    !!message.function_call
  )
  const [editFunctionCall, setEditFunctionCall] = useState(
    message.function_call
      ? {
          name: message.function_call.name,
          arguments: JSON.parse(message.function_call.arguments)
        }
      : { name: '', arguments: {} }
  )

  const editorOptions: EditorProps['options'] = {
    minimap: {
      enabled: false
    },
    fontSize: 14,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    scrollbar: {
      alwaysConsumeMouseWheel: false
    }
  }

  // function handleDidMount(editor: any, monaco: Monaco) {
  //   monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  //     validate: true,
  //   });
  // }

  function cancelEdit() {
    setIsEditing(false)
    setEditRole(message.role)
    setEditName(message.name)
    setEditContent(message.content)
    setEditFunctionContent(
      message.role === 'function' ? JSON.parse(message.content) : {}
    )
    setEditFunctionCall(
      message.function_call
        ? message.function_call
        : { name: '', arguments: {} }
    )
    if (message.isEdit) {
      cancelInsert()
    }
  }

  function saveEdit() {
    saveMessage({
      role: editRole,
      name: editName,
      content:
        editRole === 'function'
          ? JSON.stringify(editFunctionContent)
          : editContent,
      function_call: editWithFunctionCall
        ? {
            name: editFunctionCall.name,
            arguments: JSON.stringify(editFunctionCall.arguments)
          }
        : undefined
    })
    setIsEditing(false)
  }

  return (
    <div className="flex w-full flex-col pl-12">
      <div className="mb-5 flex w-full flex-col justify-between">
        <p className="mb-2">Role:</p>
        <Select value={editRole} onValueChange={value => setEditRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="assistant">Assistant</SelectItem>
              <SelectItem value="function">Function</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {['user', 'system'].includes(editRole) && (
        <div className="mb-5">
          <Textarea
            value={editContent}
            onChange={ev => setEditContent(ev.target.value)}
          />
        </div>
      )}

      {editRole === 'assistant' && (
        <div className="mb-5">
          <div className="mb-5 flex">
            <label htmlFor="function-call" style={{ paddingRight: 15 }}>
              Function Call
            </label>
            <Switch
              checked={editWithFunctionCall}
              onCheckedChange={value => setWithFunctionCall(value)}
              id="function-call"
            />
          </div>

          {editWithFunctionCall && (
            <Editor
              height="150px"
              theme="vs-dark"
              defaultLanguage="json"
              options={editorOptions}
              defaultValue={JSON.stringify(editFunctionCall, null, 2)}
              onMount={(editor, monaco) => {
                monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                  validate: true,
                  schemaValidation: 'error',
                  schemas: [
                    {
                      uri: 'https://dummy.json.schema/function-call',
                      fileMatch: ['*'],
                      schema: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          arguments: {
                            type: 'object'
                          }
                        },
                        required: ['name', 'arguments'],
                      },
                    }
                  ],
                })
              }}
              onChange={(value, ev) => setEditFunctionCall(JSON.parse(value!))}
            />
          )}

          {!editWithFunctionCall && (
            <Textarea
              value={editContent}
              onChange={ev => setEditContent(ev.target.value)}
            />
          )}
        </div>
      )}

      {['function'].includes(editRole) && (
        <div className="mb-5">
          <div className="mb-5">
            <div className="mb-5 flex w-full flex-col justify-between">
              <p className="mb-2">Name:</p>
              <Input
                value={editName}
                onChange={ev => setEditName(ev.target.value)}
              />
            </div>

            <div className="py-3">
              <Editor
                height="150px"
                theme="vs-dark"
                defaultLanguage="json"
                options={editorOptions}
                defaultValue={JSON.stringify(editFunctionContent, null, 2)}
                onMount={(editor, monaco) => {
                  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                    validate: true,
                    schemaValidation: 'error',
                    schemas: [
                      {
                        uri: 'https://dummy.json.schema/function-call-return',
                        fileMatch: ['*'],
                        schema: {
                          type: 'object',
                        },
                      }
                    ],
                  })
                }}
                onChange={(value, ev) =>
                  setEditFunctionContent(JSON.parse(value!))
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button className="mr-5" onClick={saveEdit}>
          Save
        </Button>
        <Button variant="destructive" onClick={cancelEdit}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
