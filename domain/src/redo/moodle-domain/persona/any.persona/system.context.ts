import * as moo from 'moodle-domain'
import { Permissions, Permissions_Gate } from './system.context/permissions.scope'

export type System = moo.DefContext<{ permissions: Permissions }>

export const System_Gate: moo.Gate_Context<System> = {
  permissions: Permissions_Gate,
}
