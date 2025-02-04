import * as moo from 'moodle-domain'
import { UserAccess } from './access.scope/userAccess.usecase'

export type Access = moo.DefScope<{ userAccess: UserAccess }>
