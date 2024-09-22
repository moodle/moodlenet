import { concrete } from '@moodle/lib-ddd'
import { __redacted__key, email_address_schema, encrypted_token_schema } from '@moodle/lib-types'
import { intersection, object, string } from 'zod'
import { PrimaryMsgSchemaConfigs } from '../types'

export async function fetchPrimarySchemas(pri: concrete<'pri'>) {
  const {
    iam: { primaryMsgSchemaConfigs },
  } = await pri.moodle.iam.v1_0.pri.configs.read()
  return getPrimarySchemas(primaryMsgSchemaConfigs)
}

// export type primary_schemas = Awaited<ReturnType<typeof getPrimarySchemas>>
export function getPrimarySchemas({ user, myAccount }: PrimaryMsgSchemaConfigs) {
  const email = intersection(email_address_schema, string().min(user.email.min).max(user.email.max))
  const password = string().min(user.password.min).max(user.password.max)
  const displayName = string().min(user.displayName.min).max(user.displayName.max)
  const redacted_password = object({
    [__redacted__key]: password,
  })

  const signupSchema = object({
    email,
    password: redacted_password,
    displayName,
  })

  const changePasswordSchema = object({
    currentPassword: redacted_password,
    newPassword: redacted_password,
  })

  const selfDeletionSchema = object({
    reason: string()
      .min(myAccount.selfDeletionRequestReason.min)
      .max(myAccount.selfDeletionRequestReason.max),
    token: encrypted_token_schema,
  })

  const resetPasswordSchema = object({
    newPassword: redacted_password,
    token: encrypted_token_schema,
  })

  const loginSchema = object({
    email,
    password: redacted_password,
  })

  return {
    raw: {
      user: {
        encrypted_token_schema,
        email,
        redacted_password,
        displayName,
      },
    },
    resetPasswordSchema,
    signupSchema,
    loginSchema,
    changePasswordSchema,
    selfDeletionSchema,
  }
}
