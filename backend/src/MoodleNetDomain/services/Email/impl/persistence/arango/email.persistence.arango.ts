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
        INSERT ${document}} INTO ${SentEmail.name}
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
    const doc = await (
      await db.query(aql`
        UPDATE DOCUMENT("${VerifyEmail.name}/${key}")
        WITH { attempts: OLD.attempts + 1 }
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
        insert ${document} INTO ${VerifyEmail.name}
        RETURN NEW._key
      `)
    ).next()
    return key
  },
}

module.exports = arangoEmailPersistenceImpl
export default arangoEmailPersistenceImpl
