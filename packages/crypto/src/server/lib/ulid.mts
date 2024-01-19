import * as ulidx from 'ulidx'
import { shell } from '../shell.mjs'

//const globalMono = ulidx.monotonicFactory()

export function create(opts?: { globalMono?: boolean; now?: Date | number }) {
  const now = opts?.now ? new Date(opts.now) : shell.now()
  // const genUlid = opts?.globalMono ? globalMono : ulidx.ulid
  const genUlid = ulidx.ulid
  return { now, ulid: genUlid(now.valueOf()) }
}
