import { email_address, redacted, unbranded } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { object, ZodType } from 'zod'
import { SUBMITTED } from '../../../../../lib/constants'
import { systemDirectives, systemDirectivesZodSchemas } from '../../../anyUser/anyUserPersona'
import { USER_WITH_EMAL_EXISTS } from '../consts'

export type Anonymous_EmailSignup_RequestSignupWithMyEmail_apply = moo.DefUseCaseEp<
  [signupForm, Either<USER_WITH_EMAL_EXISTS, SUBMITTED>]
>

export type signupForm = {
  email: email_address
  password: redacted<string>
  displayName: string
}

export function zodSchema(systemDirectives: systemDirectives): ZodType<unbranded<signupForm>> {
  const { password, userDisplayName, userEmail } = systemDirectivesZodSchemas(systemDirectives)

  const signupFormSchema = object({
    email: userEmail,
    password,
    displayName: userDisplayName,
  })

  return signupFormSchema
}
