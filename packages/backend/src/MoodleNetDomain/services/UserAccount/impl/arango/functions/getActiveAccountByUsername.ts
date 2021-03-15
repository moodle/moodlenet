import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { ActiveUserAccount, Persistence, UserAccountStatus } from '../types'

export const getActiveAccountByUsername = async ({
  username,
  persistence: { UserAccount, db },
}: {
  username: string
  persistence: Persistence
}) => {
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount}
    FILTER userAccount.username == ${username}
          && userAccount.status == ${UserAccountStatus.Active}
    LIMIT 1
    RETURN userAccount
  `)
  const mAccount: Maybe<ActiveUserAccount> = await cursor.next()
  return mAccount
}
