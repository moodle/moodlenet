import { aql } from 'arangojs'
import { UserAccountDB } from '../env'
import { UserAccountStatus } from '../types'
export const deleteNewAccountRequest = async ({
  token,
  db: { db, UserAccount },
}: {
  db: UserAccountDB
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
