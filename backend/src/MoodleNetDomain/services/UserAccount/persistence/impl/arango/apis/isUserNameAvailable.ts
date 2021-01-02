import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import { AccountDocument, UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const isUserNameAvailable: UserAccountPersistence['isUserNameAvailable'] = async ({
  username,
}) => {
  const { db } = await DBReady
  //FIXME : RETURN Documnet(_id)
  const cursor = await db.query(aql`
    FOR doc IN Account
    FILTER doc.username==${username}
    LIMIT 1
    RETURN doc 
  `)
  const accountWithSameUsername: Maybe<AccountDocument> = await cursor.next()
  return !accountWithSameUsername
}
