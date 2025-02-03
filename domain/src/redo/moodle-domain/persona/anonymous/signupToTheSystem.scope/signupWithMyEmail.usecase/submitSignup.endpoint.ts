import { email_address, redacted, unbranded } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { object, ZodType } from 'zod'
import { SUBMITTED } from '../../../../../lib/constants'
import { GeneralDirectives, generalDirectivesZodSchemas } from '../../../any/any.persona'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'

export type submitSignup = moo.DefUseCaseEp<[signupForm, Either<typeof USER_WITH_THIS_EMAIL_EXISTS, typeof SUBMITTED>]>

export type signupForm = {
  email: email_address
  password: redacted<string>
  displayName: string
}

export function signupFormZodSchema(serviceDirectives: GeneralDirectives): ZodType<unbranded<signupForm>> {
  const { password, userDisplayName, userEmail } = generalDirectivesZodSchemas(serviceDirectives)

  const signupFormSchema = object({
    email: userEmail,
    password,
    displayName: userDisplayName,
  })

  return signupFormSchema
}
