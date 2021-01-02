import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import {
  NewAccountRequestDocument,
  NewAccountRequestDocumentStatus,
  UserAccountPersistence,
} from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'

export const newAccountRequestExpired: UserAccountPersistence['newAccountRequestExpired'] = async ({
  flow,
}) => {
  const { db } = await DBReady
  const expiredStatus: NewAccountRequestDocumentStatus = 'Confirm Expired'
  const waitingStatus: NewAccountRequestDocumentStatus =
    'Waiting Email Confirmation'
  const cursor = await db.query(aql`
    LET doc = DOCUMENT(CONCAT("NewAccountRequest/",${flow._key}))
    UPDATE doc
    WITH (
      doc.status == ${waitingStatus}
      ? {
        status:${expiredStatus},
        updatedAt: DATE_NOW()
      }
      : {}
    )
    IN NewAccountRequest
    RETURN NEW
  `)
  const requestDoc: Maybe<NewAccountRequestDocument> = await cursor.next()
  return requestDoc
}
