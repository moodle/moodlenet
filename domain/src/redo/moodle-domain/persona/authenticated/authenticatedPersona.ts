import * as moo from 'moodle-domain'

declare module 'moodle-domain' {
  interface Personas {
    authenticated: DefPersona<{
      context: AuthenticatedPersonaContext
      systems: DefPersonaSystems<AuthenticatedPersonaSystems>
    }>
  }
}

export interface AuthenticatedPersonaContext {
  authenticatedId: string
}

export interface AuthenticatedPersonaSystems {

}
