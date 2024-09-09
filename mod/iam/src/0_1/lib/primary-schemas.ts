import { object, string, z } from 'zod'
import { PrimarySchemasConfigs } from '../types'

export type loginMessage = z.infer<ReturnType<typeof getPrimarySchemas>['loginSchema']>

export type signupMessage = z.infer<ReturnType<typeof getPrimarySchemas>['signupSchema']>

export function getPrimarySchemas({ user }: PrimarySchemasConfigs) {
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
