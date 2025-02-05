import * as moo from 'moodle-domain'
import { permissions } from './permissions.scope/read.usecase'

export type Access = moo.DefScope<{ permissions: permissions }>
