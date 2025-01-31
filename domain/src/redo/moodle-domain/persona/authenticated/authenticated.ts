import * as moo from 'moodle-domain'

export type authenticated = moo.DefPersona<{
  context: AuthenticatedPersonaContext
  systems: moo.DefPersonaSystems<AuthenticatedPersonaSystems>
}>

export interface AuthenticatedPersonaContext {
  authenticatedId: string
}

export interface AuthenticatedPersonaSystems {}
