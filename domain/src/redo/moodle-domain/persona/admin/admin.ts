import * as moo from 'moodle-domain'

export type admin = moo.DefPersona<{
  context: AdminPersonaContext
  systems: moo.DefPersonaSystems<AdminPersonaSystems>
}>

export type AdminPersonaContext = never

export interface AdminPersonaSystems {}
