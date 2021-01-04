import { aql } from 'arangojs'
import { Messages, UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const changePassword: UserAccountPersistence['changePassword'] = async ({
  accountId,
  newPassword,
}) => {
  const { db } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount._id == ${accountId} 
    LIMIT 1
    UPDATE userAccount WITH { 
      password: ${newPassword}
    } IN UserAccount
    RETURN NEW
  `)
  const doc = await cursor.next()
  if (!doc) {
    return Messages.NotFound
  }
  return null
}
