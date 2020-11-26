import { aql } from 'arangojs'
import { EmailPersistence, SentEmailDocument, VerifyEmailDocument } from '../../../types'
import { db /* log */ } from './email.persistence.arango.env'

export const VerifyEmail = db.collection<VerifyEmailDocument>('VerifyEmail')
export const SentEmail = db.collection<SentEmailDocument>('SentEmail')

const arangoEmailPersistenceImpl: EmailPersistence = {
  async storeSentEmail({ email, emailId, flowId }) {
    const document: SentEmailDocument = {
      ...flowId,
      at: new Date(),
      email,
      emailId,
    }

    const key = await (
      await db.query(aql`
        INSERT ${document} 
        INTO SentEmail
        RETURN NEW._key
      `)
    ).next()
    return key
  },
  async getVerifyingEmail({ flowId }) {
    const doc = await VerifyEmail.document({ _key: flowId._key })
    return doc
  },
  async incAttemptVerifyingEmail({ flowId }) {
    const doc = await (
      await db.query(aql`
        LET doc = DOCUMENT(CONCAT("VerifyEmail/",${flowId._key}))
        UPDATE doc
        WITH { attempts: (doc.attempts+1) }
        IN VerifyEmail
        RETURN NEW
      `)
    ).next()
    return doc
  },
  async storeVerifyingEmail({ req, flowId, token }) {
    const document: VerifyEmailDocument = {
      ...flowId,
      attempts: 0,
      req,
      token,
    }
    const key = await (
      await db.query(aql`
        INSERT ${document} 
        INTO VerifyEmail
        RETURN NEW._key
      `)
    ).next()
    return key
  },
  async confirmEmail({ token }) {
    const doc = await (
      await db.query(aql`
        FOR doc in VerifyEmail
        FILTER doc.token==${token}
        LIMIT 1
        RETURN doc
      `)
    ).next()
    return doc
  },
}

module.exports = arangoEmailPersistenceImpl
export default arangoEmailPersistenceImpl
