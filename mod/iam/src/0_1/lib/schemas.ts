import { object, string, z } from 'zod'
import { ValidationConfigs } from '../types'

export type loginFormValues = z.infer<ReturnType<typeof getSchemas>['loginSchema']>

export type signupFormValues = z.infer<ReturnType<typeof getSchemas>['signupSchema']>

export function getSchemas({ user }: ValidationConfigs) {
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
