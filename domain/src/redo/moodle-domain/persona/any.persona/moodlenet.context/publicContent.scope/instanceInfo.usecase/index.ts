import { about } from './about.endpoint'

declare module '..' {
  interface Scope {
    instanceInfo: instanceInfo
  }
}

export type instanceInfo = moo.persona.usecase<{
  about: about
}>
export const instanceInfo: moo.gate.usecase<instanceInfo> = {
  about: about,
}
