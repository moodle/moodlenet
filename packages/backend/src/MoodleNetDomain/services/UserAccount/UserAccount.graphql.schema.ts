import { ServiceExecutableSchemaDefinition } from '../../MoodleNetGraphQL'
import { changeEmailConfirm } from './apis/UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
import { changeEmailRequest } from './apis/UserAccount.ChangeMainEmail.Request.'
import { changePassword } from './apis/UserAccount.ChangePassword'
import { activateAccount } from './apis/UserAccount.RegisterNewAccount.ActivateNewAccount'
import { signUp } from './apis/UserAccount.RegisterNewAccount.Request'
import { sessionByEmail } from './apis/UserAccount.Session.ByEmail'
import { createSession } from './apis/UserAccount.Session.Create'
import { getSession } from './apis/UserAccount.Session.Get'

import { getAccountPersistence } from './UserAccount.env'
import { Resolvers } from './UserAccount.graphql.gen'

export const getUserAccountServiceExecutableSchemaDefinition = async (): Promise<ServiceExecutableSchemaDefinition> => {
  const { graphQLTypeResolvers } = await getAccountPersistence()

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
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
  }

  return { resolvers }
}
