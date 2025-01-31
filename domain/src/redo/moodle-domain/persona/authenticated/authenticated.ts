import * as moo from 'moodle-domain'

export type authenticated = moo.DefPersona<{
  context: AuthenticatedPersonaContext
  services: moo.DefPersonaServices<AuthenticatedPersonaServices>
}>

export interface AuthenticatedPersonaContext {
  authenticatedId: string
}

export interface AuthenticatedPersonaServices {}
