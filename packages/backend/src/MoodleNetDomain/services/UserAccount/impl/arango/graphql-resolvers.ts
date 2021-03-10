import { Resolvers } from '../../UserAccount.graphql.gen'
import { activateAccount } from './apis/activateNewAccount'
import { changeEmailRequest } from './apis/changeMainEmailRequest'
import { changePassword } from './apis/changePassword'
import { changeEmailConfirm } from './apis/confirmAndChangeAccountEmail'
import { createSession } from './apis/createSession'
import { getSession } from './apis/getSession'
import { sessionByEmail } from './apis/getSessionByEmail'
import { signUp } from './apis/registerNewAccountRequest'

export const userAccountGraphQLResolvers: Resolvers = {
  Query: {
    getSession,
  },
  Mutation: {
    activateAccount,
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
