import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  Messages,
  UserAccountPersistence,
  UserAccountRecord,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const confirmAccountEmailChangeRequest: UserAccountPersistence['confirmAccountEmailChangeRequest'] = async ({
  token,
}) => {
  const { db } = await DBReady
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
      FILTER userAccount.changeEmailRequest.token == ${token}
      LIMIT 1
        UPDATE userAccount WITH {
          email: userAccount.changeEmailRequest.email,
          changeEmailRequest: null
        } IN UserAccount
      RETURN userAccount
  `)
  const mAccount: Maybe<UserAccountRecord> = await cursor.next()

  if (!mAccount) {
    return Messages.NotFound
  }

  return null
}
