import type { z } from 'zod'
import type { fetchPrimarySchemas, getPrimarySchemas } from '../lib/primary-schemas'
export interface PrimaryMsgSchemaConfigs {
  user: {
    email: { max: number; min: number }
    password: { max: number; min: number }
    displayName: { max: number; min: number }
  }
  myAccount: {
    selfDeletionRequestReason: { max: number; min: number }
  }
}
export type loginForm = z.infer<ReturnType<typeof getPrimarySchemas>['loginSchema']>

export type signupForm = z.infer<ReturnType<typeof getPrimarySchemas>['signupSchema']>

export type changePasswordForm = z.infer<
  ReturnType<typeof getPrimarySchemas>['changePasswordSchema']
>
export type resetPasswordForm = z.infer<ReturnType<typeof getPrimarySchemas>['resetPasswordSchema']>
