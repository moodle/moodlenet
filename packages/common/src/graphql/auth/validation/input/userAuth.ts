import { object, SchemaOf, string } from 'yup'
import * as GQL from '../../../types.graphql.gen'
import { email } from './common'

export const token = string()
export const username = string()
export const password = string()

export const signUp: SchemaOf<GQL.MutationSignUpArgs> = object({
  email: email.required(),
})

export const changeEmailRequest: SchemaOf<GQL.MutationChangeEmailRequestArgs> = object({
  newEmail: email.required(),
})

export const changeEmailConfirm: SchemaOf<GQL.MutationChangeEmailConfirmArgs> = object({
  username: username.required(),
  password: password.required(),
  token: token.required(),
})

export const changePassword: SchemaOf<GQL.MutationChangePasswordArgs> = object({
  newPassword: password.required(),
  currentPassword: password.required(),
})

export const activateUser: SchemaOf<GQL.MutationActivateUserArgs> = object({
  username: username.required(),
  password: password.required(),
  token: token.required(),
})

export const createSession: SchemaOf<GQL.MutationCreateSessionArgs> = object({
  username: username.required(),
  password: password.required(),
})

export const sessionByEmail: SchemaOf<GQL.MutationSessionByEmailArgs> = object({
  username: username.required(),
  email: email.required(),
})
