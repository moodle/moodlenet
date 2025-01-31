import { Anonymous_EmailSignup } from './emailSignup/anonymous.emailSignup'

declare module 'moodle-domain' {
  interface Personas {
    anonymous: DefPersona<{
      context: never
      systems: DefPersonaSystems<{
        emailSignup: Anonymous_EmailSignup
      }>
    }>
  }
}
