import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import { UserAccountPersistence, UserAccountRecord } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const isEmailAvailable: UserAccountPersistence['isEmailAvailable'] = async ({ email }) => {
  const { db } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount.email == ${email}
            || userAccount.changeEmailRequest.email == ${email}
    LIMIT 1
    RETURN userAccount
  `)
  const mAccount: Maybe<UserAccountRecord> = await cursor.next()
  return !mAccount
}
