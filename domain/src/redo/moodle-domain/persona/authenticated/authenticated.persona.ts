import * as moo from 'moodle-domain'

export type authenticated = moo.DefPersona<{
  scope: moo.DefPersonaScopes<never>
  directives: null
}>

