import { edit } from './edit.usecase'
import { searchUsers } from './searchUsers.usecase'
declare module '..' {
  interface Context {
    managePermissions: managePermissions
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type managePermissions = moo.persona.scope<moo<Scope>>
export const managePermissions: moo.gate.provider.scope<managePermissions> = {
  edit,
  searchUsers,
}
