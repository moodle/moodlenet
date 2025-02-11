import { managePermissions, managePermissions_Gate } from './managePermissions.scope/managePermissions.scope'

export type userBase = moo.persona.context<{
  managePermissions: managePermissions
}>

export const userBase_Gate: moo.gate.context<userBase> = {
  managePermissions: managePermissions_Gate,
}
