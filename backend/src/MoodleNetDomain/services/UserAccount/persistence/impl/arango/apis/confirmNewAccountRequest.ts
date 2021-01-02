import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  NewAccountRequestDocument,
  NewAccountRequestDocumentStatus,
  UserAccountPersistence,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const confirmNewAccountRequest: UserAccountPersistence['confirmNewAccountRequest'] = async ({
  flow,
}) => {
  const { db } = await DBReady
  const confirmedStatus: NewAccountRequestDocumentStatus = 'Email Confirmed'

  const cursor = await db.query(aql`
    LET doc = DOCUMENT(CONCAT("NewAccountRequest/",${flow._key}))
    LET alreadyConfirmed = doc.status == ${confirmedStatus}
    UPDATE doc
    WITH (alreadyConfirmed
      ? {}
      : {
        status:${confirmedStatus},
        updatedAt: DATE_NOW()
      })
    IN NewAccountRequest
    RETURN (alreadyConfirmed ? true : NEW)
  `)
  const confirmRes: Maybe<
    NewAccountRequestDocument | true
  > = await cursor.next()

  if (!confirmRes) {
    return 'Request Not Found'
  }

  if (confirmRes === true) {
    return 'Previously Confirmed'
  }

  return 'Confirmed'
}
