import * as moo from 'moodle-domain'
import { Read, Read_Gate } from './permissions.scope/read.usecase'

export type Permissions = moo.DefScope<{ read: Read }>

export const Permissions_Gate: moo.Gate_Scope<Permissions> = {
  read: Read_Gate,
}
