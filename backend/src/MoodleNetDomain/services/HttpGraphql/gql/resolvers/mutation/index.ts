import { accountRequestConfirmEmail } from './accountRequestConfirmEmail'
import { accountSignUp } from './accountSignUp'
import { accountLogin } from './accountLogin'
import { accountRequestActivateAccount } from './accountRequestActivateAccount'
import { MutationResolvers } from '../../../../../graphql'

export const Mutation: MutationResolvers = {
  accountRequestConfirmEmail,
  accountSignUp,
  accountRequestActivateAccount,
  accountLogin,
}
