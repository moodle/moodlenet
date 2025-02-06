import { permissions, permissionsGate } from './system.context/permissions.scope'

export type system = moo.persona.context<{ permissions: permissions }>

export const systemGate: moo.gate.context<system> = {
  permissions: permissionsGate,
}
