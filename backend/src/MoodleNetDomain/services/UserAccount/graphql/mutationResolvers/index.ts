import { signUp } from './signUp'
import { createSession } from './createSession'
import { activateAccount } from './activateAccount'
import { MutationResolvers } from '../../UserAccount.graphql.gen'
import { changeEmailRequest } from './changeEmailRequest'
import { changeEmailConfirm } from './changeEmailConfirm'
import { changePassword } from './changePassword'
import { sessionByEmail } from './sessionByEmail'

export const Mutation: MutationResolvers = {
  activateAccount,
  changeEmailConfirm,
  changeEmailRequest,
  changePassword,
  createSession,
  signUp,
  sessionByEmail,
}
