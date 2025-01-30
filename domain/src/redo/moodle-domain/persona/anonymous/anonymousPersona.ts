import { Anonymous_EmailSignup_SystemAccess } from './systemsAccess/emailSignup/signupWithMyEmail'

declare module 'moodle-domain' {
  interface Personas {
    anonymous: DefPersona<{
      context: never
      systems: DefPersonaSystems<{
        emailSignup: Anonymous_EmailSignup_SystemAccess
      }>
    }>
  }
}
