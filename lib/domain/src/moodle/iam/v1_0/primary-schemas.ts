import { __redacted__key } from '@moodle/lib-types'
import { object, string } from 'zod'
import { PrimaryMsgSchemaConfigs } from './types'

export function getPrimarySchemas({ user }: PrimaryMsgSchemaConfigs) {
  const email = string().email().min(user.email.min).max(user.email.max)
  const password = string().min(user.password.min).max(user.password.max)
  const displayName = string().min(user.displayName.min).max(user.displayName.max)
  const redacted_password = object({
    [__redacted__key]: password,
  })

  const signupSchema = object({
    email,
    password: redacted_password,
    displayName,
  }).required()

  const changePasswordSchema = object({
    currentPassword: redacted_password,
    newPassword: redacted_password,
  }).required()

  const loginSchema = object({
    email,
    password: redacted_password,
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
    changePasswordSchema,
  }
}
