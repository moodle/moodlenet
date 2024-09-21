import { __redacted__key } from '@moodle/lib-types'
import { object, string } from 'zod'
import { PrimaryMsgSchemaConfigs } from '../types'

export type primary_schemas = Awaited<ReturnType<typeof getPrimarySchemas>>
export function getPrimarySchemas({ user }: PrimaryMsgSchemaConfigs) {
  const email = string().email().min(user.email.min).max(user.email.max)
  const encrypted_token = string().min(10).max(2048)
  const password = string().min(user.password.min).max(user.password.max)
  const displayName = string().min(user.displayName.min).max(user.displayName.max)
  const redacted_password = object({
    [__redacted__key]: password,
  })

  const signupSchema = object({
    email,
    password: redacted_password,
    displayName,
  }) //.required()

  const changePasswordSchema = object({
    currentPassword: redacted_password,
    newPassword: redacted_password,
  }) //.required()

  const resetPasswordSchema = object({
    newPassword: redacted_password,
    token: encrypted_token,
  }) //.required()

  const loginSchema = object({
    email,
    password: redacted_password,
  }) //.required()

  return {
    raw: {
      user: {
        encrypted_token,
        email,
        redacted_password,
        displayName,
      },
    },
    resetPasswordSchema,
    signupSchema,
    loginSchema,
    changePasswordSchema,
  }
}
