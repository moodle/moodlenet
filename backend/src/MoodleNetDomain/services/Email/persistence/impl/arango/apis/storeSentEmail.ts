import { aql } from 'arangojs'
import { EmailPersistence } from '../../../types'
import { DBReady } from '../Email.persistence.arango.env'
import { SentEmailDocument } from '../types'

export const storeSentEmail: EmailPersistence['storeSentEmail'] = async _ => {
  const { db } = await DBReady

  const { email, flow, result } = _

  const record: Omit<SentEmailDocument, 'createdAt' | '_id'> = {
    email,
    _flow: flow,
    result,
  }
  const cursor = await db.query(aql`
        LET now = DATE_NOW()
        INSERT MERGE(
          ${record},
          { 
            createdAt: now
          }
        )
        INTO SentEmail
        RETURN NEW
      `)
  const doc = (await cursor.next()) as SentEmailDocument
  return doc
}
