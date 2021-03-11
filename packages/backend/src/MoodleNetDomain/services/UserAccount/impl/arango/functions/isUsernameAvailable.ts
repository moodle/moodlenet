import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { Persistence, UserAccountRecord } from '../types'

export const isUsernameAvailable = async ({
  username,
  persistence: { db },
}: {
  username: string
  persistence: Persistence
}) => {
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount.username == ${username}
    LIMIT 1
    RETURN userAccount
  `)
  const mAccount: Maybe<UserAccountRecord> = await cursor.next()
  return !mAccount
}
