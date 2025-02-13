import { user } from './user.endpoint'
declare module '..' {
  interface Scope {
    send: send
  }
}

export type send = moo.persona.usecase<{
  user: user
}>

export const send: moo.gate.usecase<send> = {
  user,
}
