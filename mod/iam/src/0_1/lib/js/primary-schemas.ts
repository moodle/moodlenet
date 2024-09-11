import { object, string, z } from 'zod'
import { PrimaryMsgSchemaConfigs } from '../../types'
import { __redacted__ } from '@moodle/lib-types'
import { user_plain_password } from '../../types/db/db-user'

export type loginForm = z.infer<ReturnType<typeof getPrimarySchemas>['loginSchema']>
export type _redacted_loginForm = Pick<loginForm, 'email'> & {
  password: __redacted__<user_plain_password>
}

export type signupForm = z.infer<ReturnType<typeof getPrimarySchemas>['signupSchema']>
export type _redacted_signupForm = Pick<signupForm, 'email' | 'displayName'> & {
  password: __redacted__<user_plain_password>
}

export function getPrimarySchemas({ user }: PrimaryMsgSchemaConfigs) {
  const email = string().email().min(user.email.min).max(user.email.max)
  const password = string().min(user.password.min).max(user.password.max)
  const displayName = string().min(user.displayName.min).max(user.displayName.max)

  const signupSchema = object({
    email,
    password,
    displayName,
  }).required()

  const loginSchema = object({
    email,
    password,
  }).required()

  return {
    raw: {
      user: {
        email,
        password,
        displayName,
      },
    },
    signupSchema,
    loginSchema,
  }
}
