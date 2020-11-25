import { aql } from 'arangojs'
import { EmailPersistence, SentEmailDocument, VerifyEmailDocument } from '../../../types'
import { db /* log */ } from './email.persistence.arango.env'

export const VerifyEmail = db.collection<VerifyEmailDocument>('VerifyEmail')
export const SentEmail = db.collection<SentEmailDocument>('SentEmail')

const arangoEmailPersistenceImpl: EmailPersistence = {
  async storeSentEmail({ email, emailId }) {
    const document: SentEmailDocument = {
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
  async getVerifyingEmail({ key }) {
    const doc = await VerifyEmail.document({ _key: key })
    return doc
  },
  async incAttemptVerifyingEmail({ key }) {
    const x = key
    const doc = await (
      await db.query(aql`
        UPDATE ${x}
        WITH { attempts: 11 }
        IN VerifyEmail
        RETURN NEW
      `)
    ).next()
    return doc
  },
  async storeVerifyingEmail({ req }) {
    const document: VerifyEmailDocument = {
      attempts: 0,
      req,
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
}

module.exports = arangoEmailPersistenceImpl
export default arangoEmailPersistenceImpl
