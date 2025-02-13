import { read } from './read.endpoint'
import { write } from './write.endpoint'
declare module '..' {
  interface Scope {
    preferences: preferences
  }
}

export type preferences = moo.persona.usecase<{ read: read; write: write }>
export const preferences: moo.gate.usecase<preferences> = {
  read,
  write,
}
