import { aql } from 'arangojs'
import { Persistence } from '../types'
export const deleteChangeAccountEmailRequest = async ({
  token,
  persistence: { UserAccount, db },
}: {
  persistence: Persistence
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
