import * as ulidx from 'ulidx'
import { customAlphabet } from 'nanoid'

const globalMonoUlid = ulidx.monotonicFactory()
export async function generateUlid({ onDate }: { onDate: Date | number | string }) {
  const date = new Date(onDate)
  return globalMonoUlid(date.valueOf())
}

export async function createAlphaNumericId(opts?: { alpabet?: string; length?: number }) {
  const id = customAlphabet(
    opts?.alpabet || `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`,
    8,
  )(opts?.length)
  return id
}
