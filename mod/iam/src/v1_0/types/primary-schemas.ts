import type { z } from 'zod'
import type { getIamPrimarySchemas } from '../lib/primary-schemas'
export interface IamPrimaryMsgSchemaConfigs {
  user: {
    email: { max: number; min: number }
    password: { max: number; min: number }
    displayName: { max: number; min: number }
  }
  myAccount: {
    selfDeletionRequestReason: { max: number; min: number }
  }
}
export type loginForm = z.infer<ReturnType<typeof getIamPrimarySchemas>['loginSchema']>

export type signupForm = z.infer<ReturnType<typeof getIamPrimarySchemas>['signupSchema']>

export type changePasswordForm = z.infer<ReturnType<typeof getIamPrimarySchemas>['changePasswordSchema']>
export type resetPasswordForm = z.infer<
  ReturnType<typeof getIamPrimarySchemas>['resetPasswordSchema']
>
