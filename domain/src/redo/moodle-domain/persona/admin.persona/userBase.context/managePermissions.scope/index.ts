import { personaTypes } from './personaTypes.usecase'
declare module '..' {
  interface Context {
    managePermissions: managePermissions
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type managePermissions = moo.persona.scope<moo.typ<Scope>>
export const managePermissions: moo.gate.scope<managePermissions> = {
  personaTypes: personaTypes,
}
