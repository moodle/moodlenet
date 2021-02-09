import { aql } from 'arangojs'
import { UserAccountPersistence, UserAccountStatus } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
export const deleteNewAccountRequest: UserAccountPersistence['deleteNewAccountRequest'] = async ({ token }) => {
  const { db, UserAccount } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount}
      FILTER userAccount.firstActivationToken == ${token}
          && userAccount.status == ${UserAccountStatus.WaitingFirstActivation}
      LIMIT 1
      REMOVE userAccount IN ${UserAccount}
      RETURN null
  `)
  await cursor.next()

  return null
}
