import { confirmSignUpEmail } from './confirmSignUpEmail'
import { signUp } from './signUp'
import { login } from './login'
import { activateAccount } from './activateAccount'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { changeEmailRequest } from './changeEmailRequest'
import { changeEmailConfirm } from './changeEmailConfirm'
import { changePassword } from './changePassword'
import { tempSessionByEmail } from './tempSessionByEmail'

export const Mutation: MutationResolvers = {
  activateAccount,
  changeEmailConfirm,
  changeEmailRequest,
  changePassword,
  confirmSignUpEmail,
  login,
  signUp,
  tempSessionByEmail,
}
