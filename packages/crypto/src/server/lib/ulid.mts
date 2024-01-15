import { monotonicFactory } from 'ulidx'
import { shell } from '../shell.mjs'
export * as ulidx from 'ulidx'

const monotonic = monotonicFactory()
export function create() {
  const now = shell.now()
  return { now, ulid: monotonic(now.valueOf()) }
}
