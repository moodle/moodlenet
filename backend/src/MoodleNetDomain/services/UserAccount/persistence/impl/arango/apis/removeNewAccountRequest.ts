import { aql } from 'arangojs'
import { UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const removeNewAccountRequest: UserAccountPersistence['removeNewAccountRequest'] = async ({
  token,
}) => {
  const { db, UserAccount } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount.name}
    FILTER userAccount.firstActivationToken == ${token}
    LIMIT 1
    REMOVE userAccount IN ${UserAccount.name}
    RETURN null
  `)
  await cursor.next()
  return null
}
