import * as moo from 'moodle-domain'

export type authenticated = moo.DefPersona<{
  context: AuthenticatedPersonaContext
  scope: moo.DefPersonaScopes<never>
}>

export interface AuthenticatedPersonaContext {
  authenticatedId: string
}
