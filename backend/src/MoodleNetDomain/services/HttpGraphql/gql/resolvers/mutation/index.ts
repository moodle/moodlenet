import { MutationResolvers } from '../../types'
import { accountConfirmEmail } from './accountConfirmEmail'
import { accountSignUp } from './accountSignUp'

export const Mutation: MutationResolvers = {
  accountConfirmEmail,
  accountSignUp,
}
