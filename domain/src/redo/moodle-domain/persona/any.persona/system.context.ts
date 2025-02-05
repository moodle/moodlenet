import * as moo from 'moodle-domain'
import { Access } from './system.context/permissions.scope'

export type System = moo.DefContext<{ access: Access }>
