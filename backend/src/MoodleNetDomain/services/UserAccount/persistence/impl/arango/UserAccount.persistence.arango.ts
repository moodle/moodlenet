import { UserAccountPersistence } from '../../types'
import { activateNewAccount } from './apis/activateNewAccount'
import { addChangeAccountEmailRequest } from './apis/addChangeAccountEmailRequest'
import { addNewAccountRequest } from './apis/addNewAccountRequest'
import { changeAccountEmailRequestExpired } from './apis/changeAccountEmailRequestExpired'
import { changePassword } from './apis/changePassword'
import { confirmAccountEmailChangeRequest } from './apis/confirmAccountEmailChangeRequest'
import { confirmNewAccountRequest } from './apis/confirmNewAccountRequest'
import { getAccountByUsername } from './apis/getAccountByUsername'
import { getConfig } from './apis/getConfig'
import { isUserNameAvailable } from './apis/isUserNameAvailable'
import { newAccountRequestExpired } from './apis/newAccountRequestExpired'
import { userAccountTypeResolvers } from './graphqlTypeResolvers'

export const arangoUserAccountPersistence: UserAccountPersistence = {
  graphQLTypeResolvers: userAccountTypeResolvers,
  changePassword,
  addNewAccountRequest,
  confirmNewAccountRequest,
  newAccountRequestExpired,
  isUserNameAvailable,
  activateNewAccount,
  getConfig,
  getAccountByUsername,
  addChangeAccountEmailRequest,
  confirmAccountEmailChangeRequest,
  changeAccountEmailRequestExpired,
}
