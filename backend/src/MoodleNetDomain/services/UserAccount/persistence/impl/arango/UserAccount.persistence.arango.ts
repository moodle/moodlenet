import { UserAccountPersistence } from '../../types'
import { activateNewAccount } from './apis/activateNewAccount'
import { changeAccountEmailRequest } from './apis/changeAccountEmailRequest'
import { changePassword } from './apis/changePassword'
import { confirmAccountEmailChangeRequest } from './apis/confirmAccountEmailChangeRequest'
import { deleteChangeAccountEmailRequest } from './apis/deleteChangeAccountEmailRequest'
import { deleteNewAccountRequest } from './apis/deleteNewAccountRequest'
import { getActiveAccountByUsername } from './apis/getActiveAccountByUsername'
import { getConfig } from './apis/getConfig'
import { isEmailAvailable } from './apis/isEmailAvailable'
import { isUsernameAvailable } from './apis/isUsernameAvailable'
import { newAccountRequest } from './apis/newAccountRequest'
import { userAccountTypeResolvers } from './graphqlTypeResolvers'

export const arangoUserAccountPersistence: UserAccountPersistence = {
  deleteNewAccountRequest,
  activateNewAccount,
  changeAccountEmailRequest,
  changePassword,
  confirmAccountEmailChangeRequest,
  getActiveAccountByUsername,
  isUsernameAvailable,
  getConfig,
  isEmailAvailable,
  newAccountRequest,
  deleteChangeAccountEmailRequest,
  graphQLTypeResolvers: userAccountTypeResolvers,
}
