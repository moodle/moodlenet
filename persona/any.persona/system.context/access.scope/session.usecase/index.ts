import { myOwn } from './myOwn.endpoint'

declare module '..' {
  interface Scope {
    session: session
  }
}

export type session = moo.persona.usecase<{
  myOwn: myOwn
}>
export const session: moo.def.gate.provider.usecase<session> = {
  myOwn,
}
