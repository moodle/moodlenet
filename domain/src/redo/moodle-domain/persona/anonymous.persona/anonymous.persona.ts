import * as moo from 'moodle-domain'
import { Access, Access_Gate } from './access.context'

export type Anonymous = moo.DefPersona<{ access: Access }> //,{a:1}>

export const Anonymous_Gate: moo.Gate_Persona<Anonymous> = {
  access: Access_Gate,
}
