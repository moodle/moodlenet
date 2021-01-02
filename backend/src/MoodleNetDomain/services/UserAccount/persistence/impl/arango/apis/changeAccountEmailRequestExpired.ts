import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  ChangeAccountEmailRequestDocument,
  ChangeAccountEmailRequestDocumentStatus,
  UserAccountPersistence,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
export const changeAccountEmailRequestExpired: UserAccountPersistence['changeAccountEmailRequestExpired'] = async ({
  flow,
}) => {
  const { db } = await DBReady
  const expiredStatus: ChangeAccountEmailRequestDocumentStatus =
    'Confirm Expired'
  const waitingStatus: ChangeAccountEmailRequestDocumentStatus =
    'Waiting Email Confirmation'
  const cursor = await db.query(aql`
    LET doc = DOCUMENT(CONCAT("ChangeAccountEmailRequest/",${flow._key}))
    UPDATE doc
    WITH (
      doc.status == ${waitingStatus}
      ? {
        status:${expiredStatus},
        updatedAt: DATE_NOW()
      }
      : {}
    )
    IN ChangeAccountEmailRequest
    RETURN NEW
  `)
  const requestDoc: Maybe<ChangeAccountEmailRequestDocument> = await cursor.next()
  return requestDoc
}
