'use server'

import fs from 'fs/promises'
import { glob } from 'glob'

import { Message } from '@/lib/types';

export async function getAllConvos(): Promise<string[]> {
  // console.log(await glob('convos/*-data.json'));
  return glob('convos/*-data.json');
}

export async function getMessagesFromConvo(id: string): Promise<Message[]> {
  const file = await fs.readFile(`convos/${id}.json`, 'utf-8');
  const events = (JSON.parse(file) as any[]).map((event) => {
    return {
      value: event.value,
      context: event.context,
      event: event.event,
    };
  });

  await fs.writeFile(`convos/${id}-reduced.json`, JSON.stringify(events, null, 2));

  const dataFile = await fs.readFile(`convos/${id}-data.json`, 'utf-8');
  return JSON.parse(dataFile).messagesHistory;
}
