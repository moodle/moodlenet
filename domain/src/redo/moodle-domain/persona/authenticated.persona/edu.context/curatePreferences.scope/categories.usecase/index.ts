import { read } from './read.endpoint'
import { write } from './write.endpoint'
declare module '..' {
  interface Scope {
    categories: categories
  }
}

export type categories = moo.persona.usecase<{ read: read; write: write }>
export const categories: moo.gate.provider.usecase<categories> = {
  read,
  write,
}
