'use server'

import fs from 'fs/promises'
import { existsSync } from 'fs'
import { glob } from 'glob'

import { Message } from '@/lib/types'

const subfolder = 'inquiry'

export async function getAllConvos(): Promise<string[]> {
  const files = await glob(`convos/${subfolder}/*-data.json`)
  return files.map(file =>
    file.replace(`convos/${subfolder}/`, '').replace('-data.json', '')
  )
}

export async function getMessagesFromConvo(id: string): Promise<Message[]> {
  if (existsSync(`convos/${subfolder}/${id}.json`)) {
    const file = await fs.readFile(`convos/${subfolder}/${id}.json`, 'utf-8')
    const events = (JSON.parse(file) as any[]).map(event => {
      return {
        value: event.value,
        context: event.context,
        event: event.event
      }
    })

    await fs.writeFile(
      `convos/${subfolder}/${id}-reduced.json`,
      JSON.stringify(events, null, 2)
    )
  }

  const dataFile = await fs.readFile(
    `convos/${subfolder}/${id}-data.json`,
    'utf-8'
  )

  return JSON.parse(dataFile).messagesHistory
}

export async function saveMessagesIntoConvo(
  id: string,
  messagesHistory: Message[],
  functions: any[]
): Promise<any> {
  // const dataFile = await fs.readFile(`convos/${subfolder}/${id}-data.json`, 'utf-8');
  // const data = JSON.parse(dataFile);
  const data = {
    messagesHistory,
    functions
  }

  const newFolder = 'inquiry-fixed'

  await fs.writeFile(
    `convos/${subfolder}/${id}-data.json`,
    JSON.stringify(data, null, 2)
  )

  // move the files `{folder}/{id}-data.json`, `{folder}/{id}-reduced.json` and `{folder}/{id}.json` to `convos/{newFolder}/`
  await fs.rename(
    `convos/${subfolder}/${id}-data.json`,
    `convos/${newFolder}/${id}-data.json`
  )
  await fs.rename(
    `convos/${subfolder}/${id}-reduced.json`,
    `convos/${newFolder}/${id}-reduced.json`
  )
  await fs.rename(
    `convos/${subfolder}/${id}.json`,
    `convos/${newFolder}/${id}.json`
  )

  return data
}
