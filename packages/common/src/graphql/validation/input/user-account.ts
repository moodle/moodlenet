import * as Yup from 'yup'
import * as GQL from '../../../pub-graphql/types.graphql.gen'
import { email } from './common'

export const token = Yup.string().uuid()
export const username = Yup.string()
export const password = Yup.string()

export const signUp: Yup.SchemaOf<GQL.MutationSignUpArgs> = Yup.object({
  email: email.required(),
})

export const changeEmailRequest: Yup.SchemaOf<GQL.MutationChangeEmailRequestArgs> = Yup.object({
  newEmail: email.required(),
})

export const changeEmailConfirm: Yup.SchemaOf<GQL.MutationChangeEmailConfirmArgs> = Yup.object({
  username: username.required(),
  password: password.required(),
  token: token.required(),
})

export const changePassword: Yup.SchemaOf<GQL.MutationChangePasswordArgs> = Yup.object({
  newPassword: password.required(),
  currentPassword: password.required(),
})

export const activateAccount: Yup.SchemaOf<GQL.MutationActivateAccountArgs> = Yup.object({
  username: username.required(),
  password: password.required(),
  token: token.required(),
})

export const createSession: Yup.SchemaOf<GQL.MutationCreateSessionArgs> = Yup.object({
  username: username.required(),
  password: password.required(),
})

export const sessionByEmail: Yup.SchemaOf<GQL.MutationSessionByEmailArgs> = Yup.object({
  username: username.required(),
  email: email.required(),
})
