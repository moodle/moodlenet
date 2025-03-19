import { curateInfo } from './curateInfo.scope'

declare module '..' {
  interface Persona {
    organization: organization
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type organization = moo.persona.context<moo<Context>>
export const organization: moo.gate.provider.context<organization> = {
  curateInfo,
}
