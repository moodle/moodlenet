import { managePermissions } from './managePermissions.scope'
declare module '..' {
  interface Persona {
    userBase: userBase
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type userBase = moo.persona.context<moo<Context>>
export const userBase: moo.gate.provider.context<userBase> = {
  managePermissions,
}
