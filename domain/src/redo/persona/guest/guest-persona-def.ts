/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { Either } from 'fp-ts/Either'
import { INVALID_TOKEN } from '../../lib/types'
import type * as moo from '../../moodle-domain'
import { map, signed_token, url_string } from '@moodle/lib-types'

declare module '../../moodle-domain' {
  interface Personas {
    guest: GuestPersona
  }
}

export type GuestPersona = moo.DefPersona<{
  useCase: {
    signupWithMyEmail: {
      request: [{ signupForm: signupForm; redirectUrl: url_string }, Either<USER_WITH_SAME_EMAIL_EXISTS, 'submitted'>]
      confirm: [{ emailVerificationToken: signed_token }, Either<INVALID_TOKEN | USER_WITH_SAME_EMAIL_EXISTS, 'confirmed'>]
    }
  }
  model: map
}>

export const USER_WITH_SAME_EMAIL_EXISTS = 'USER_WITH_SAME_EMAIL_EXISTS'
export type USER_WITH_SAME_EMAIL_EXISTS = typeof USER_WITH_SAME_EMAIL_EXISTS
