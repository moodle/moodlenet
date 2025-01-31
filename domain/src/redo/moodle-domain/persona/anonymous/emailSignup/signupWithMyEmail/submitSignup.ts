import { email_address, redacted, unbranded } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { object, ZodType } from 'zod'
import { SUBMITTED } from '../../../../../lib/constants'
import { systemDirectives, systemDirectivesZodSchemas } from '../../../any/any'
import { USER_WITH_EMAL_EXISTS } from '../consts'

export type submitSignup = moo.DefUseCaseEp<[signupForm, Either<USER_WITH_EMAL_EXISTS, SUBMITTED>]>

export type signupForm = {
  email: email_address
  password: redacted<string>
  displayName: string
}

export function signupFormZodSchema(systemDirectives: systemDirectives): ZodType<unbranded<signupForm>> {
  const { password, userDisplayName, userEmail } = systemDirectivesZodSchemas(systemDirectives)

  const signupFormSchema = object({
    email: userEmail,
    password,
    displayName: userDisplayName,
  })

  return signupFormSchema
}
