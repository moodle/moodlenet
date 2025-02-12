import { myOwn } from './myOwn.endpoint'

declare module '..' {
  interface Scope {
    session: session
  }
}

export type session = moo.persona.usecase<{
  myOwn: myOwn
}>
export const session: moo.gate.usecase<session> = {
  myOwn: myOwn,
}
