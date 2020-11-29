import { MutationResolvers } from '../../types'
import { accountRequestConfirmEmail } from './accountRequestConfirmEmail'
import { accountSignUp } from './accountSignUp'
import { accountRequestActivateAccount } from './accountRequestActivateAccount'

export const Mutation: MutationResolvers = {
  accountRequestConfirmEmail,
  accountSignUp,
  accountRequestActivateAccount,
}
