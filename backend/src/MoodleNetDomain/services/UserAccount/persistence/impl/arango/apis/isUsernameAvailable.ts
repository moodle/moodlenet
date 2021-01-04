import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import { UserAccountPersistence, UserAccountRecord } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const isUsernameAvailable: UserAccountPersistence['isUsernameAvailable'] = async ({
  username,
}) => {
  const { db } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount.username == ${username}
    LIMIT 1
    RETURN userAccount
  `)
  const mAccount: Maybe<UserAccountRecord> = await cursor.next()
  return !mAccount
}
