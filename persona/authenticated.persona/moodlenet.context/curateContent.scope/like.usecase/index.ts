import { resource } from './resource.endpoint'

declare module '..' {
  interface Scope {
    like: like
  }
}

export type like = moo.persona.usecase<{
  resource: resource
}>
export const like: moo.gate.provider.usecase<like> = {
  resource,
}
