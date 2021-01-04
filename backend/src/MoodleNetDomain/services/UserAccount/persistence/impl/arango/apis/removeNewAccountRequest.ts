import { aql } from 'arangojs'
import { UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const removeNewAccountRequest: UserAccountPersistence['removeNewAccountRequest'] = async ({
  token,
}) => {
  const { db } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount.firstActivationToken == ${token}
    LIMIT 1
    REMOVE userAccount IN UserAccount
    RETURN null
  `)
  await cursor.next()
  return null
}
