import { aql } from 'arangojs'
import {
  createDatabaseIfNotExists,
  createDocumentCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import { EmailPersistence, SentEmailDocument, VerifyEmailDocument } from '../../../types'
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
  async storeSentEmail({ email, emailId, flow }) {
    const document: SentEmailDocument = {
      ...flow,
      at: new Date(),
      email,
      emailId,
    }

    const key = await (
      await (await db).query(aql`
        INSERT ${document} 
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
  async incAttemptVerifyingEmail({ flow }) {
    const doc = await (
      await (await db).query(aql`
        LET doc = DOCUMENT(CONCAT("VerifyEmail/",${flow._key}))
        UPDATE doc
        WITH { attempts: (doc.attempts+1) }
        IN VerifyEmail
        RETURN NEW
      `)
    ).next()
    return doc
  },
  async storeVerifyingEmail({ req, flow, token }) {
    const document: VerifyEmailDocument = {
      ...flow,
      attempts: 0,
      req,
      token,
    }
    const key = await (
      await (await db).query(aql`
        INSERT ${document} 
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
