'use server'

import fs from 'fs/promises'
import { glob } from 'glob'

import { Message } from '@/lib/types';

export async function getAllConvos(): Promise<string[]> {
  return glob('convos/dnc/*-data.json');
}

export async function getMessagesFromConvo(id: string): Promise<Message[]> {
  const file = await fs.readFile(`convos/dnc/${id}.json`, 'utf-8');
  const events = (JSON.parse(file) as any[]).map((event) => {
    return {
      value: event.value,
      context: event.context,
      event: event.event,
    };
  });

  await fs.writeFile(`convos/dnc/${id}-reduced.json`, JSON.stringify(events, null, 2));

  const dataFile = await fs.readFile(`convos/dnc/${id}-data.json`, 'utf-8');
  return JSON.parse(dataFile).messagesHistory;
}

export async function saveMessagesIntoConvo(id: string, messages: Message[]): Promise<Message[]> {
  const dataFile = await fs.readFile(`convos/dnc/${id}-data.json`, 'utf-8');
  const data = JSON.parse(dataFile);
  data.messagesHistory = messages;
  await fs.writeFile(`convos/dnc/${id}-data.json`, JSON.stringify(data, null, 2));

  return messages;
}
