import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  ActiveUserAccount,
  UserAccountPersistence,
  UserAccountStatus,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const getActiveAccountByUsername: UserAccountPersistence['getActiveAccountByUsername'] = async ({
  username,
}) => {
  const { db } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount.username == ${username}
          && userAccount.status == ${UserAccountStatus.Active}
    LIMIT 1
    RETURN userAccount
  `)
  const mAccount: Maybe<ActiveUserAccount> = await cursor.next()
  return mAccount
}
