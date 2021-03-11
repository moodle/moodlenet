import { aql } from 'arangojs'
import { Flow } from '../../../../../../lib/domain/flow'
import { SendResult } from '../../../EmailDomain'
import { EmailObj } from '../../../types'
import { ArangoEmailDB } from '../env'
import { SentEmailDocument } from '../types'

export const storeSentEmail = async ({
  email,
  flow,
  result,
  db: { db, SentEmail },
}: {
  email: EmailObj
  flow: Flow
  result: SendResult
  db: ArangoEmailDB
}) => {
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
        INTO ${SentEmail}
        RETURN NEW
  `)
  // const doc = (await cursor.next()) as SentEmailDocument
  await cursor.next()
  cursor.kill()
  return null as unknown
}
