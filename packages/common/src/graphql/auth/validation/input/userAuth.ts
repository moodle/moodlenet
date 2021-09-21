import { object, SchemaOf, string } from 'yup'
import * as GQL from '../../../types.graphql.gen'
import { email } from './common'

export const token = string()
export const password = string()

// export const signUp: SchemaOf<GQL.MutationSignUpArgs> = object({
//   email: email.required(),
// })

// export const changeEmailRequest: SchemaOf<GQL.MutationChangeEmailRequestArgs> = object({
//   newEmail: email.required(),
// })

// export const changeEmailConfirm: SchemaOf<GQL.MutationChangeEmailConfirmArgs> = object({
//   password: password.required(),
//   changeEmailToken: token.required(),
// })

// export const changePassword: SchemaOf<GQL.MutationChangePasswordArgs> = object({
//   newPassword: password.required(),
//   currentPassword: password.required(),
// })

// export const activateUser: SchemaOf<GQL.MutationActivateUserArgs> = object({
//   name: string().required(),
//   password: password.required(),
//   activationToken: token.required(),
// })

export const createSession: SchemaOf<GQL.MutationCreateSessionArgs> = object({
  email: email.required(),
  password: password.required(),
  activationEmailToken: string().notRequired(),
})

// export const sessionByEmail: SchemaOf<GQL.MutationSessionByEmailArgs> = object({
//   email: email.required(),
// })
