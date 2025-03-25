import { read } from './read.endpoint'
import { edit } from './edit.endpoint'
declare module '..' {
  interface Scope {
    preferences: preferences
  }
}

export type preferences = moo.persona.usecase<{ read: read; edit: edit }>
export const preferences: moo.gate.provider.usecase<preferences> = {
  read,
  edit,
}
