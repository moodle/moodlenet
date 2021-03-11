import { aql } from 'arangojs'
import { Persistence, UserAccountStatus } from '../types'
export const deleteNewAccountRequest = async ({
  token,
  persistence: { db, UserAccount },
}: {
  persistence: Persistence
  token: string
}) => {
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount}
      FILTER userAccount.firstActivationToken == ${token}
          && userAccount.status == ${UserAccountStatus.WaitingFirstActivation}
      LIMIT 1
      REMOVE userAccount IN ${UserAccount}
      RETURN null
  `)
  await cursor.next()
}
