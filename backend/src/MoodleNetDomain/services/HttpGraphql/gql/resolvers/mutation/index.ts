import { accountRequestConfirmEmail } from './accountRequestConfirmEmail'
import { accountSignUp } from './accountSignUp'
import { accountLogin } from './accountLogin'
import { accountRequestActivateAccount } from './accountRequestActivateAccount'
import { MutationResolvers } from '../../../../../graphql'
import { accountChangeEmailRequest } from './accountChangeEmailRequest'
import { accountChangeEmailConfirm } from './accountChangeEmailConfirm'

export const Mutation: MutationResolvers = {
  accountRequestConfirmEmail,
  accountSignUp,
  accountRequestActivateAccount,
  accountChangeEmailConfirm,
  accountChangeEmailRequest,
  accountLogin,
}
