import { UserAccountPersistence } from '../../types'
import { activateNewAccount } from './apis/activateNewAccount'
import { changeAccountEmailRequest } from './apis/changeAccountEmailRequest'
import { newAccountRequest } from './apis/newAccountRequest'
import { changePassword } from './apis/changePassword'
import { confirmAccountEmailChangeRequest } from './apis/confirmAccountEmailChangeRequest'
import { getConfig } from './apis/getConfig'
import { getActiveAccountByUsername } from './apis/getActiveAccountByUsername'
import { removeChangeAccountEmailRequest } from './apis/removeChangeAccountEmailRequest'
import { removeNewAccountRequest } from './apis/removeNewAccountRequest'
import { userAccountTypeResolvers } from './graphqlTypeResolvers'
import { isEmailAvailable } from './apis/isEmailAvailable'
import { isUsernameAvailable } from './apis/isUsernameAvailable'

export const arangoUserAccountPersistence: UserAccountPersistence = {
  activateNewAccount,
  changeAccountEmailRequest,
  changePassword,
  confirmAccountEmailChangeRequest,
  getActiveAccountByUsername,
  isUsernameAvailable,
  getConfig,
  isEmailAvailable,
  newAccountRequest,
  removeChangeAccountEmailRequest,
  removeNewAccountRequest,
  graphQLTypeResolvers: userAccountTypeResolvers,
}
