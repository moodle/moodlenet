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
    const { email, response, flow } = _

    const document: Omit<SentEmailDocument, 'createdAt'> = {
      ...flow,
      ...response,
      email,
    }

    const key = await (
      await (await db).query(aql`
        INSERT MERGE(
          ${document},
          { createdAt: DATE_NOW() } 
        )
        INTO SentEmail
        RETURN NEW._key
      `)
    ).next()
    return key
  },
  async getVerifyingEmail({ flow }) {
    const doc = await (await VerifyEmail).document({ _key: flow._key })
    return doc
  },
  async incrementAttemptVerifyingEmail({ flow }) {
    const ExpiredStatus: VerifyEmailDocumentStatus = 'Expired'
    const doc: Maybe<VerifyEmailDocument> = await (
      await (await db).query(aql`
        LET doc = DOCUMENT(CONCAT("VerifyEmail/",${flow._key}))
        UPDATE doc
        WITH doc.attempts < doc.maxAttempts 
          ? { attempts: doc.attempts + 1 } 
          : { status: "${ExpiredStatus}" }
        IN VerifyEmail
        RETURN NEW
      `)
    ).next()
    return doc
  },
  async storeVerifyingEmail({ req, flow, token }) {
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
