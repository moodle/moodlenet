import { aql } from 'arangojs'
import { Maybe } from 'graphql/jsutils/Maybe'
import {
  Messages,
  UserAccountPersistence,
  UserAccountRecord,
  UserAccountStatus,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
export const activateNewAccount: UserAccountPersistence['activateNewAccount'] = async ({
  token,
  password,
  username,
}) => {
  const { UserAccount, db } = await DBReady

  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount.name}
    FILTER userAccount.firstActivationToken == ${token}
    LIMIT 1
    UPDATE WITH UNSET({
      updatedAt: DATE_NOW(),
      password: ${password},
      username: ${username},
      status: ${UserAccountStatus.Active}
      changeEmailRequest: null,
    }, "firstActivationToken")
    RETURN NEW
  `)

  const newAccountDoc: Maybe<UserAccountRecord> = await cursor.next()

  if (!newAccountDoc) {
    return Messages.NotFound
  }

  return newAccountDoc
}
