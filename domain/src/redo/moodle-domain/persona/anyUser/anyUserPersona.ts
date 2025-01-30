import * as moo from 'moodle-domain'

declare module 'moodle-domain' {
  interface Personas {
    anyUser: DefPersona<{
      context: AnyUserPersonaContext
      systems: DefPersonaSystems<AnyUserPersonaSystems>
    }>
  }
}

export interface AnyUserPersonaContext {
  systemAccesses: unknown
}

export interface AnyUserPersonaSystems {

}
