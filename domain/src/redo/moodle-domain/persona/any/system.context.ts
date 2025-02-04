import * as moo from 'moodle-domain'
import { Access } from './system.context/access.scope'

export type System = moo.DefContext<{ access: Access }>
