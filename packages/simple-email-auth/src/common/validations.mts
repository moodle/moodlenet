import { displayNameSchema } from '@moodlenet/web-user/common'
import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import type { SignupReq } from '../server/types.mjs'

const emailSchema = string().email().required(`Please provide your email`)
const passwordSchema = string()
  .max(80, obj => {
    const length = obj.value.length
    return `Please provide a shorter password (${length} > 80)`
  })
  .min(8, obj => {
    const length = obj.value.length
    return `Please provide a longer password (${length} < 8)`
  })
  .required(`Please provide a password`)

export const newPasswordValidationSchema: SchemaOf<{ newPassword: string }> = object({
  newPassword: passwordSchema,
})

export const recoverPasswordValidationSchema: SchemaOf<{ email: string }> = object({
  email: emailSchema,
})

const tokenSchema = string().required()
export const confirmSignupEmailValidationSchema: SchemaOf<{ confirmToken: string }> = object({
  confirmToken: tokenSchema,
})

export const loginValidationSchema: SchemaOf<{ email: string; password: string }> = object({
  email: emailSchema,
  password: passwordSchema,
})

export const signupValidationSchema: SchemaOf<SignupReq> = object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
})

export const changePasswordUsingTokenSchema: SchemaOf<{
  password: string
  token: string
}> = object({
  password: passwordSchema,
  token: tokenSchema,
})

export const setPasswordSchema: SchemaOf<{ password: string }> = object({
  password: passwordSchema,
})

export const requestPasswordChangeByEmailLinkSchema: SchemaOf<{ email: string }> = object({
  email: emailSchema,
})
