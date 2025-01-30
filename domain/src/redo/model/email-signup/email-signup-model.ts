/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type * as moo from '../../moodle-domain'

declare module '../../moodle-domain' {
  interface Model {
    emailSignup: EmailSignupModel
  }
}

export type EmailSignupModel = moo.DefModel<{}>
