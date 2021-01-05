import { aql } from 'arangojs'
import { Maybe } from 'graphql/jsutils/Maybe'
import {
  ActiveUserAccount,
  Messages,
  UserAccountPersistence,
  UserAccountStatus,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
import { isUsernameAvailable } from './isUsernameAvailable'
export const activateNewAccount: UserAccountPersistence['activateNewAccount'] = async ({
  token,
  password,
  username,
}) => {
  const { db } = await DBReady

  const usernameAvailable = await isUsernameAvailable({ username })

  if (!usernameAvailable) {
    return Messages.UsernameNotAvailable
  }
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount.firstActivationToken == ${token}
    LIMIT 1
    UPDATE userAccount WITH {
      updatedAt: DATE_NOW(),
      password: ${password},
      username: ${username},
      status: ${UserAccountStatus.Active},
      changeEmailRequest: null
    } IN UserAccount
    RETURN NEW
  `)

  const newAccountDoc: Maybe<ActiveUserAccount> = await cursor.next()

  if (!newAccountDoc) {
    return Messages.NotFound
  }

  return newAccountDoc
}
