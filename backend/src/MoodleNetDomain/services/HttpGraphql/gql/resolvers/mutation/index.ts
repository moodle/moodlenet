import { accountRequestConfirmEmail } from './accountRequestConfirmEmail'
import { accountSignUp } from './accountSignUp'
import { accountRequestActivateAccount } from './accountRequestActivateAccount'
import { MutationResolvers } from '../../../../../graphql'

export const Mutation: MutationResolvers = {
  accountRequestConfirmEmail,
  accountSignUp,
  accountRequestActivateAccount,
}
