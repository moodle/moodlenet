import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  Messages,
  UserAccountPersistence,
  UserAccountRecord,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
export const removeChangeAccountEmailRequest: UserAccountPersistence['removeChangeAccountEmailRequest'] = async ({
  token,
}) => {
  const { db, UserAccount } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount.name}
      FILTER userAccount.changeEmailRequest.token == ${token}
      LIMIT 1
        UPDATE userAccount WITH {
          changeEmailRequest: null
        } IN ${UserAccount.name}
      RETURN userAccount
  `)
  const mAccount: Maybe<UserAccountRecord> = await cursor.next()

  if (!mAccount) {
    return Messages.NotFound
  }

  return null
}
