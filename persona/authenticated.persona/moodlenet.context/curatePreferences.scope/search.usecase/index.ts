import { read } from './read.endpoint'
import { edit } from './edit.endpoint'
declare module '..' {
  interface Scope {
    search: search
  }
}

export type search = moo.persona.usecase<{ read: read; edit: edit }>
export const search: moo.gate.provider.usecase<search> = {
  read,
  edit,
}
