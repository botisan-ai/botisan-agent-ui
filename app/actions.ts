'use server'
import fs from 'fs/promises'
import { glob } from 'glob'

export async function getAllConvos(): Promise<string[]> {
  console.log(await glob('convos/*-data.json'));
  return glob('convos/*-data.json');
}
