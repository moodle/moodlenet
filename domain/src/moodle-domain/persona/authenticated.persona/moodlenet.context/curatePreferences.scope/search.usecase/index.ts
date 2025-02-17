import { read } from './read.endpoint'
import { write } from './write.endpoint'
declare module '..' {
  interface Scope {
    search: search
  }
}

export type search = moo.persona.usecase<{ read: read; write: write }>
export const search: moo.gate.provider.usecase<search> = {
  read,
  write,
}
