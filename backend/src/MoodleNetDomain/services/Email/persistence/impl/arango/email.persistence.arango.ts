import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import {
  EmailPersistence,
  SentEmailDocument,
  SentEmailRecord,
  VerifyEmailDocument,
  VerifyEmailDocumentStatus,
} from '../../types'
import { DBReady } from './email.persistence.arango.env'

export const arangoEmailPersistence: Promise<EmailPersistence> = DBReady.then(
  ({ VerifyEmail, db /* ,SentEmail */ }) => {
    const storeSentEmail: EmailPersistence['storeSentEmail'] = async (_) => {
      const { email, response, flow } = _

      const record: Omit<SentEmailRecord, 'createdAt'> = {
        ...response,
        email,
      }
      const insertDocument: Omit<SentEmailDocument, 'sentEmails'> = {
        ...flow,
      }

      const cursor = await db.query(aql`
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

      const sentEmailCount = await cursor.next()
      return { sentEmails: sentEmailCount }
    }

    const getVerifyingEmail: EmailPersistence['getVerifyingEmail'] = async ({ flow }) => {
      const doc = await VerifyEmail.document({ _key: flow._key })
      return doc
    }

    const incrementAttemptVerifyingEmail: EmailPersistence['incrementAttemptVerifyingEmail'] = async ({
      flow,
    }) => {
      const expiredStatus: VerifyEmailDocumentStatus = 'Expired'
      const verifyingStatus: VerifyEmailDocumentStatus = 'Verifying'
      const documentId = `VerifyEmail/${flow._key}`
      const cursor = await db.query(aql`
        LET doc = DOCUMENT(${documentId})
        LET status = doc.status
        LET maxAttemptsReached = doc.attempts >= doc.req.maxAttempts
        UPDATE doc
        WITH (
          status == ${verifyingStatus}
            ? maxAttemptsReached
              ? { status: ${expiredStatus} }
              : { attempts: doc.attempts + 1 } 
            : {}
        )
        IN VerifyEmail
        RETURN NEW
      `)
      const doc: Maybe<VerifyEmailDocument> = await cursor.next()
      return doc
    }

    const storeVerifyingEmail: EmailPersistence['storeVerifyingEmail'] = async ({
      req,
      flow,
      token,
    }) => {
      const document: Omit<VerifyEmailDocument, 'createdAt'> = {
        ...flow,
        attempts: 0,
        req,
        token,
        status: 'Verifying',
      }
      const cursor = await db.query(aql`
      INSERT MERGE(
        ${document},
        { createdAt: DATE_NOW() } 
        )
        INTO VerifyEmail
        RETURN NEW._key
        `)
      const key: string = await cursor.next()
      return key
    }

    const confirmEmail: EmailPersistence['confirmEmail'] = async ({ token }) => {
      const verifiedStatus: VerifyEmailDocumentStatus = 'Verified'
      const res = await (
        await db.query(aql`
        FOR doc in VerifyEmail
          FILTER doc.token==${token}
          LIMIT 1
          UPDATE doc WITH { status:${verifiedStatus} } IN VerifyEmail
        RETURN {
          current:NEW,
          prevStatus:OLD.status
        }
      `)
      ).next()
      return res
    }
    return {
      confirmEmail,
      getVerifyingEmail,
      incrementAttemptVerifyingEmail,
      storeSentEmail,
      storeVerifyingEmail,
    }
  }
)
