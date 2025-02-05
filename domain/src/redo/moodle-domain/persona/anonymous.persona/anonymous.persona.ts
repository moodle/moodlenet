import * as moo from 'moodle-domain'
import { Access } from './access.context'

export type anonymous = moo.DefPersona<{ access: Access }>//,{a:1}>
