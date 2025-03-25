import { read } from './read.endpoint'
import { edit } from './edit.endpoint'
declare module '..' {
  interface Scope {
    categories: categories
  }
}

export type categories = moo.persona.usecase<{ read: read; edit: edit }>
export const categories: moo.gate.provider.usecase<categories> = {
  read,
  edit,
}
