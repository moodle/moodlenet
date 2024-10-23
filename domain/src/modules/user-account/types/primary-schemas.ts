import {
  __redacted_schema__,
  email_address_schema,
  signed_token_schema,
  single_line_string_schema,
} from '@moodle/lib-types'
import type { z } from 'zod'
import { any, object, string, ZodString } from 'zod'
export interface userAccountPrimaryMsgSchemaConfigs {
  user: {
    email: { max: number }
    password: { max: number; min: number }
    displayName: { max: number; min: number; regex: null | [regex: string, flags: string] }
  }
  myAccount: {
    selfDeletionRequestReason: { max: number }
  }
}
export type loginForm = z.infer<ReturnType<typeof getuserAccountPrimarySchemas>['loginSchema']>

export type signupForm = z.infer<ReturnType<typeof getuserAccountPrimarySchemas>['signupSchema']>

export type changePasswordForm = z.infer<ReturnType<typeof getuserAccountPrimarySchemas>['changePasswordSchema']>
export type resetPasswordForm = z.infer<ReturnType<typeof getuserAccountPrimarySchemas>['resetPasswordSchema']>

export function getuserAccountPrimarySchemas({ user, myAccount }: userAccountPrimaryMsgSchemaConfigs) {
  const email = string().max(user.email.max).pipe(email_address_schema)

  const password = string().trim().min(user.password.min).max(user.password.max).pipe(single_line_string_schema)
  const displayName = string()
    .trim()
    .min(user.displayName.min)
    .max(user.displayName.max)
    .pipe(user.displayName.regex ? string().regex(new RegExp(...user.displayName.regex)) : (any() as unknown as ZodString))
    .pipe(single_line_string_schema)

  const redacted_password = __redacted_schema__(password)

  const signupSchema = object({
    email,
    password: redacted_password,
    displayName,
  })

  const changePasswordSchema = object({
    currentPassword: redacted_password,
    newPassword: redacted_password,
  }).superRefine(({ currentPassword, newPassword }, ctx) => {
    if (currentPassword.__redacted__ === newPassword.__redacted__) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must be different',
        path: ['newPassword.__redacted__'],
      })
    }
  })

  const selfDeletionSchema = object({
    reason: string().trim().max(myAccount.selfDeletionRequestReason.max).default(''),
    token: signed_token_schema,
  })

  const resetPasswordSchema = object({
    newPassword: redacted_password,
    token: signed_token_schema,
  })

  const loginSchema = object({
    email,
    password: redacted_password,
  })

  return {
    raw: {
      user: {
        signed_token_schema,
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

// CHECK: This is a solution to the password complexity issue from https://forum.codewithmosh.com/t/password-complexity-for-zod/23622
//! eventually add this to password schema, after investigating on how to configure it
// CHECK this too (and others) https://grad.ucla.edu/gasaa/etd/specialcharacters.pdf
// string().superRefine((password, checkPassComplexity) => {
//   const containsUppercase = (ch: string) => /[A-Z]/.test(ch)
//   const containsLowercase = (ch: string) => /[a-z]/.test(ch)
//   const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch)
//   let countOfUpperCase = 0,
//     countOfLowerCase = 0,
//     countOfNumbers = 0,
//     countOfSpecialChar = 0
//   for (let i = 0; i < password.length; i++) {
//     const ch = password.charAt(i)
//     if (!isNaN(+ch)) countOfNumbers++
//     else if (containsUppercase(ch)) countOfUpperCase++
//     else if (containsLowercase(ch)) countOfLowerCase++
//     else if (containsSpecialChar(ch)) countOfSpecialChar++
//   }
//   if (
//     countOfLowerCase < 1 ||
//     countOfUpperCase < 1 ||
//     countOfSpecialChar < 1 ||
//     countOfNumbers < 1
//   ) {
//     checkPassComplexity.addIssue({
//       code: 'custom',
//       message: 'password does not meet complexity requirements',
//     })
//   }
// })
