import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import type { SimpleEmailAuthExposeType } from './expose-def.mjs'
export type MyWebDeps = { me: SimpleEmailAuthExposeType }

export const newPasswordValidationSchema: SchemaOf<{ newPassword: string }> = object({
  newPassword: string()
    .max(80, obj => {
      const length = obj.value.length
      return `Please provide a shorter password (${length} / 80)`
    })
    .min(8, obj => {
      const length = obj.value.length
      return `Please provide a longer password (${length} < 8)`
    })
    .required(`Please provide a password`),
})

export const recoverPasswordValidationSchema: SchemaOf<{ email: string }> = object({
  email: string().email().required(`Please provide your email`),
})
export type GetMySettingsDataRpc = { email: string }
