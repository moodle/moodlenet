import * as ulidx from 'ulidx'
import { shell } from '../shell.mjs'

const globalMono = ulidx.monotonicFactory()

export function create(opts?: { now?: Date | number | string }) {
  const now = opts?.now ? new Date(opts.now) : shell.now()
  return { now, ulid: globalMono(now.valueOf()) }
}
