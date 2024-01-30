import * as ulidx from 'ulidx'
import { shell } from '../shell.mjs'

const globalMono = ulidx.monotonicFactory()

export function create(opts?: { globalMono?: boolean; now?: Date | number }) {
  const now = opts?.now ? new Date(opts.now) : shell.now()
  return { now, ulid: globalMono(now.valueOf()) }
}
