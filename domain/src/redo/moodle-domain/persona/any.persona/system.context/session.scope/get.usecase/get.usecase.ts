import { myOwn } from './myOwn.endpoint'

declare module '..' {
  interface Scope {
    get: get
  }
}

export type get = moo.persona.usecase<{ myOwn: myOwn }>
export const get: moo.gate.usecase<get> = {
  myOwn: myOwn,
}
