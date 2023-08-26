// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx
'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Editor, { EditorProps } from '@monaco-editor/react'

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
import { Label } from '@/components/ui/label'

export interface ChatEditorMessageEditFormProps {
  message: Message
  setIsEditing: (param: any) => void
  saveMessage: (param: Message) => void
  deleteMessage: () => void
  cancelInsert: () => void
}

export function ChatEditorMessageEditForm({
  message,
  setIsEditing,
  saveMessage,
  deleteMessage,
  cancelInsert
}: ChatEditorMessageEditFormProps) {
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
  const [editorMarkers, setEditorMarkers] = useState<any[]>([])

  const editorOptions: EditorProps['options'] = {
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
    if (editorMarkers.length > 0) {
      toast.error('Please fix the errors in the editor')
      return
    }

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
    <div className="ml-12 flex w-full flex-col space-y-6">
      <Label htmlFor="role">Role:</Label>
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

      {['user', 'system'].includes(editRole) && (
        <>
          <Label htmlFor="role">Content:</Label>
          <Textarea
            value={editContent}
            onChange={ev => setEditContent(ev.target.value)}
          />
        </>
      )}

      {editRole === 'assistant' && (
        <>
          <div className="mb-5 flex items-center space-x-2">
            <Switch
              checked={editWithFunctionCall}
              onCheckedChange={value => setWithFunctionCall(value)}
              name="function-call"
            />
            <Label htmlFor="function-call">Function call</Label>
          </div>

          {editWithFunctionCall && (
            <Editor
              height="150px"
              theme="vs-dark"
              defaultLanguage="json"
              options={editorOptions}
              defaultPath="function-call.json"
              defaultValue={JSON.stringify(editFunctionCall, null, 2)}
              onMount={(editor, monaco) => {
                editor.addAction({
                  id: 'save',
                  label: 'Save',
                  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
                  run: saveEdit
                })
                monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                  validate: true,
                  schemaValidation: 'error',
                  schemas: [
                    {
                      uri: 'https://dummy.json.schema/function-call',
                      fileMatch: ['function-call.json'],
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
                        required: ['name', 'arguments']
                      }
                    }
                  ]
                })
              }}
              onValidate={setEditorMarkers}
              onChange={(value, ev) => setEditFunctionCall(JSON.parse(value!))}
            />
          )}

          {!editWithFunctionCall && (
            <>
              <Label htmlFor="role">Content:</Label>
              <Textarea
                value={editContent}
                onChange={ev => setEditContent(ev.target.value)}
              />
            </>
          )}
        </>
      )}

      {['function'].includes(editRole) && (
        <>
          <Label htmlFor="name">Function Name:</Label>
          <Input
            value={editName}
            onChange={ev => setEditName(ev.target.value)}
          />
          <Label htmlFor="content">Function Return:</Label>
          <Editor
            height="150px"
            theme="vs-dark"
            defaultLanguage="json"
            options={editorOptions}
            defaultPath="function-call-return.json"
            defaultValue={JSON.stringify(editFunctionContent, null, 2)}
            onMount={(editor, monaco) => {
              editor.addAction({
                id: 'save',
                label: 'Save',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
                run: saveEdit
              })
              monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemaValidation: 'error',
                schemas: [
                  {
                    uri: 'https://dummy.json.schema/function-call-return',
                    fileMatch: ['function-call-return.json'],
                    schema: {
                      type: 'object'
                    }
                  }
                ]
              })
            }}
            onValidate={setEditorMarkers}
            onChange={(value, ev) => setEditFunctionContent(JSON.parse(value!))}
          />
        </>
      )}

      <div className="flex justify-center space-x-4">
        <Button onClick={saveEdit}>Save</Button>
        <Button variant="destructive" onClick={deleteMessage}>
          Delete
        </Button>
        <Button variant="outline" onClick={cancelEdit}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
