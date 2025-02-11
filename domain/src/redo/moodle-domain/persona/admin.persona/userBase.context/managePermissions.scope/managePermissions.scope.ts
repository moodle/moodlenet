import { managePersonaTypes, managePersonaTypes_Gate } from './managePersonaTypes.usecase/managePersonaTypes.usecase'

export type managePermissions = moo.persona.scope<{ managePersonaTypes: managePersonaTypes }>
export const managePermissions_Gate: moo.gate.scope<managePermissions> = {
  managePersonaTypes: managePersonaTypes_Gate,
}
