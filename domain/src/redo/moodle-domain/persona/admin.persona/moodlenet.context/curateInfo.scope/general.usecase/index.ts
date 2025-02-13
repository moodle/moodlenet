import { edit } from './edit.endpoint'
import { read } from './read.endpoint'

declare module '..' {
  interface Scope {
    general: general
  }
}

export type general = moo.persona.usecase<{
  edit: edit
  read: read
}>
export const general: moo.gate.usecase<general> = {
  edit,
  read,
}
