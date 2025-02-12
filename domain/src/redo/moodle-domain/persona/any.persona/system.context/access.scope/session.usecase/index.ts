import { getMyOwn } from './myOwn.endpoint'

declare module '..' {
  interface Scope {
    session: session
  }
}

export type session = moo.persona.usecase<{
  getMyOwn: getMyOwn
}>
export const session: moo.gate.usecase<session> = {
  getMyOwn: getMyOwn,
}
