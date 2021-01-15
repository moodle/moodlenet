import { aql } from 'arangojs'
import { UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
export const deleteChangeAccountEmailRequest: UserAccountPersistence['deleteChangeAccountEmailRequest'] = async ({
  token,
}) => {
  const { db, UserAccount } = await DBReady
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
