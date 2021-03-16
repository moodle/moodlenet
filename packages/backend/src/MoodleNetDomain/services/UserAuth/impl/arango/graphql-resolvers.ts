import { Resolvers } from '../../UserAuth.graphql.gen'
import { activateUser } from './apis/activateNewUser'
import { changeEmailRequest } from './apis/changeMainEmailRequest'
import { changePassword } from './apis/changePassword'
import { changeEmailConfirm } from './apis/confirmAndChangeUserEmail'
import { createSession } from './apis/createSession'
import { getSession } from './apis/getSession'
import { sessionByEmail } from './apis/getSessionByEmail'
import { signUp } from './apis/registerNewUserRequest'

export const userAuthGraphQLResolvers: Resolvers = {
  Query: {
    getSession,
  },
  Mutation: {
    activateUser,
    changeEmailConfirm,
    changeEmailRequest,
    changePassword,
    createSession,
    signUp,
    sessionByEmail,
  },
  SimpleResponse: {} as any,
  UserSession: {} as any,
  DateTime: {} as any,
  Empty: {} as any,
  Never: {} as any,
  CreateSession: {} as any,
}
