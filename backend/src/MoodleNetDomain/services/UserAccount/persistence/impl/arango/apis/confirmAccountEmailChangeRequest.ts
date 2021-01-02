import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  ChangeAccountEmailRequestDocument,
  NewAccountRequestDocumentStatus,
  UserAccountPersistence,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const confirmAccountEmailChangeRequest: UserAccountPersistence['confirmAccountEmailChangeRequest'] = async ({
  flow,
}) => {
  const confirmedStatus: NewAccountRequestDocumentStatus = 'Email Confirmed'
  const { db, Account } = await DBReady
  const cursor = await db.query(aql`
    LET doc = DOCUMENT(CONCAT("ChangeAccountEmailRequest/",${flow._key}))
    LET alreadyConfirmed = doc.status == ${confirmedStatus}
    UPDATE doc
    WITH (alreadyConfirmed
      ? {}
      : {
        status:${confirmedStatus},
        updatedAt: DATE_NOW()
      })
    IN ChangeAccountEmailRequest
    RETURN (alreadyConfirmed ? true : NEW)
  `)
  const confirmRes: Maybe<
    ChangeAccountEmailRequestDocument | true
  > = await cursor.next()

  if (!confirmRes) {
    return 'Request Not Found'
  }

  if (confirmRes === true) {
    return 'Previously Confirmed'
  }

  await Account.update(confirmRes.username, { email: confirmRes.newEmail })

  return 'Confirmed'
}
