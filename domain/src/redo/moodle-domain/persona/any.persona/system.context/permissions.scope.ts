import * as moo from 'moodle-domain'
import { Read } from './permissions.scope/read.usecase'

export type Permissions = moo.DefScope<{ read: Read }>
