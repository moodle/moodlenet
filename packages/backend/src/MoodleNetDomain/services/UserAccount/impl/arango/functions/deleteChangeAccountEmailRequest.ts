import { aql } from 'arangojs'
import { UserAccountDB } from '../env'
export const deleteChangeAccountEmailRequest = async ({
  token,
  db: { UserAccount, db },
}: {
  db: UserAccountDB
  token: string
}) => {
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount}
      FILTER userAccount.changeEmailRequest.token == ${token}
      LIMIT 1
        UPDATE userAccount WITH {
          changeEmailRequest: null
        } IN ${UserAccount}
      RETURN null
  `)
  await cursor.next()

  return null
}
