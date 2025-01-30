import * as moo from 'moodle-domain'

declare module 'moodle-domain' {
  interface Personas {
    admin: DefPersona<{
      context: AdminPersonaContext
      systems: DefPersonaSystems<AdminPersonaSystems>
    }>
  }
}

// export interface AnonymousPersonaContext{}
export type AdminPersonaContext = never

export interface AdminPersonaSystems {
  [systemName: string]: moo.SystemAccessDef
}
