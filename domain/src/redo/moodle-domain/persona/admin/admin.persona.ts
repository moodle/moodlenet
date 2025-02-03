import * as moo from 'moodle-domain'

export type admin = moo.DefPersona<{
  context: AdminPersonaContext
  scope: moo.DefPersonaScopes<never>
}>

export type AdminPersonaContext = never
