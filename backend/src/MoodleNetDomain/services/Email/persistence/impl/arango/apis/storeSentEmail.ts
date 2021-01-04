import { aql } from 'arangojs'
import { EmailPersistence } from '../../../types'
import { DBReady } from '../Email.persistence.arango.env'
import { SentEmailDocument } from '../types'

export const storeSentEmail: EmailPersistence['storeSentEmail'] = async (_) => {
  const { db, SentEmail } = await DBReady

  const { email, flow, result } = _

  const record: Omit<SentEmailDocument, 'createdAt' | '_id' | 'attempts'> = {
    email,
    flow,
  }
  const cursor = await db.query(aql`
        LET now = DATE_NOW()
        INSERT MERGE(
          ${record},
          { 
            createdAt: now 
            attempts: [ { 
              result: ${result},
              datetime: now 
            } ]
          }
        )
        INTO ${SentEmail.name}
        RETURN NEW
      `)
  const doc = (await cursor.next()) as SentEmailDocument
  return doc
}
