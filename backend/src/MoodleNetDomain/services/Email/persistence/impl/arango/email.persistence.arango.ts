import { aql } from 'arangojs'
import {
  createDatabaseIfNotExists,
  createDocumentCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import { Maybe } from '../../../../../../lib/helpers/types'
import {
  VerifyEmailDocument,
  SentEmailDocument,
  EmailPersistence,
  VerifyEmailDocumentStatus,
  SentEmailRecord,
} from '../../types'
import { env } from './email.persistence.arango.env'

export const db = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})

export const VerifyEmail = createDocumentCollectionIfNotExists<VerifyEmailDocument>({
  name: 'VerifyEmail',
  db,
  createOpts: {},
})
export const SentEmail = createDocumentCollectionIfNotExists<SentEmailDocument>({
  name: 'SentEmail',
  db,
  createOpts: {},
})

export const arangoEmailPersistenceImpl: EmailPersistence = {
  async storeSentEmail(_) {
    await SentEmail

    const { email, response, flow } = _

    const record: Omit<SentEmailRecord, 'createdAt'> = {
      ...response,
      email,
    }
    const insertDocument: Omit<SentEmailDocument, 'sentEmails'> = {
      ...flow,
    }

    const sentEmailCount = await (
      await (await db).query(aql`
        LET newRecord = MERGE(${record}, { createdAt: DATE_NOW() } )
        UPSERT { _key: ${flow._key} }
        INSERT MERGE(
          ${insertDocument},
          { sentEmails: [ newRecord ] }
        )
        UPDATE  { sentEmails: PUSH( OLD.sentEmails, newRecord ) }
        INTO SentEmail
        RETURN LENGTH(NEW.sentEmails)
      `)
    ).next()
    return { sentEmails: sentEmailCount }
  },
  async getVerifyingEmail({ flow }) {
    const doc = await (await VerifyEmail).document({ _key: flow._key })
    return doc
  },
  async incrementAttemptVerifyingEmail({ flow }) {
    await VerifyEmail

    const expiredStatus: VerifyEmailDocumentStatus = 'Expired'
    const doc: Maybe<VerifyEmailDocument> = await (
      await (await db).query(aql`
        LET doc = DOCUMENT(CONCAT("VerifyEmail/",${flow._key}))
        UPDATE doc
        WITH (doc.attempts < doc.req.maxAttempts 
          ? { attempts: doc.attempts + 1 } 
          : { status: ${expiredStatus} })
        IN VerifyEmail
        RETURN NEW
      `)
    ).next()
    return doc
  },
  async storeVerifyingEmail({ req, flow, token }) {
    await VerifyEmail
    const document: Omit<VerifyEmailDocument, 'createdAt'> = {
      ...flow,
      ...req,
      attempts: 0,
      req,
      token,
      status: 'Verifying',
    }
    const key = await (
      await (await db).query(aql`
        INSERT MERGE(
          ${document},
          { createdAt: DATE_NOW() } 
        )
        INTO VerifyEmail
        RETURN NEW._key
      `)
    ).next()
    return key
  },

  async confirmEmail({ token }) {
    await VerifyEmail
    const doc = await (
      await (await db).query(aql`
        FOR doc in VerifyEmail
        FILTER doc.token==${token}
        LIMIT 1
        RETURN doc
      `)
    ).next()
    return doc
  },
}
