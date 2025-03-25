import { send } from './send.endpoint'

declare module '..' {
  interface Scope {
    resources: resources
  }
}

export type resources = moo.persona.usecase<{
  send: send
}>
export const resources: moo.gate.provider.usecase<resources> = {
  send,
}
