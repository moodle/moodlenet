import * as Yup from 'yup'
import { email } from '../general'

export const token = Yup.string()
export const username = Yup.string()
export const password = Yup.string()

export const signUp: Yup.SchemaOf<{ email: string }> = Yup.object({
  email: email.required(),
})

export const changeEmailRequest: Yup.SchemaOf<{ newEmail: string }> = Yup.object({
  newEmail: email.required(),
})

export const changeEmailConfirm: Yup.SchemaOf<{ token: string; password: string; username: string }> = Yup.object({
  username: username.required(),
  password: password.required(),
  token: token.required(),
})

export const changePassword: Yup.SchemaOf<{ newPassword: string; currentPassword: string }> = Yup.object({
  newPassword: password.required(),
  currentPassword: password.required(),
})

export const activateAccount: Yup.SchemaOf<{ token: string; password: string; username: string }> = Yup.object({
  username: username.required(),
  password: password.required(),
  token: token.required(),
})

export const createSession: Yup.SchemaOf<{ password: string; username: string }> = Yup.object({
  username: username.required(),
  password: password.required(),
})

export const sessionByEmail: Yup.SchemaOf<{ email: string; username: string }> = Yup.object({
  username: username.required(),
  email: email.required(),
})
