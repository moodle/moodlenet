import { ServiceExecutableSchemaDefinition } from '../../MoodleNetGraphQL'
import { changeEmailConfirm } from './apis/UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email'
import { changeEmailRequest } from './apis/UserAccount.Change_Main_Email.Request.'
import { changePassword } from './apis/UserAccount.Change_Password'
import { activateAccount } from './apis/UserAccount.Register_New_Account.Activate_New_Account'
import { signUp } from './apis/UserAccount.Register_New_Account.Request'
import { sessionByEmail } from './apis/UserAccount.Session.By_Email'
import { createSession } from './apis/UserAccount.Session.Create'
import { getAccountPersistence } from './UserAccount.env'
import { Resolvers } from './UserAccount.graphql.gen'

export const getUserAccountServiceExecutableSchemaDefinition = async (): Promise<ServiceExecutableSchemaDefinition> => {
  const { graphQLTypeResolvers } = await getAccountPersistence()

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
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
