import * as moo from 'moodle-domain'

export type admin = moo.DefPersona<{
  context: AdminPersonaContext
  services: moo.DefPersonaServices<AdminPersonaServices>
}>

export type AdminPersonaContext = never

export interface AdminPersonaServices {}
