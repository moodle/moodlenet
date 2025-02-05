import * as moo from 'moodle-domain'
import { Permissions } from './system.context/permissions.scope'

export type System = moo.DefContext<{ permissions: Permissions }>
