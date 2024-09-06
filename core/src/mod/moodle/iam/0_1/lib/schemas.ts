import { string } from 'zod'
import { ValidationConfigs } from '../types'

export function getSchemas({ user }: ValidationConfigs) {
  const email = string().email().min(user.email.min).max(user.email.max)
  const password = string().min(user.password.min).max(user.password.max)
  const displayName = string().min(user.displayName.min).max(user.displayName.max)
  return {
    user: {
      email,
      password,
      displayName,
    },
  }
}
