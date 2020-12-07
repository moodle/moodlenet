import { Flow } from '../../../../lib/domain/types/path'
import { Maybe, CreatedDocumentBase } from '../../../../lib/helpers/types'
import { EmailObj, VerifyEmailReq } from '../types'

interface EmailPersistence {
  storeSentEmail(_: {
    email: EmailObj
    response: SentKO | SentOK
    flow: Flow
  }): Promise<{ sentEmails: number }>
  storeVerifyingEmail(_: { req: VerifyEmailReq; token: string; flow: Flow }): Promise<string>
  getVerifyingEmail(_: { flow: Flow }): Promise<Maybe<VerifyEmailDocument>>
  incrementAttemptVerifyingEmail(_: { flow: Flow }): Promise<Maybe<VerifyEmailDocument>>
  confirmEmail(_: {
    token: string
  }): Promise<
    Maybe<{
      current: VerifyEmailDocument
      prevStatus: VerifyEmailDocumentStatus
    }>
  >
}

// ^ VerifyEmailDocument
type VerifyEmailDocumentStatus = 'Verifying' | 'Verified' | 'Expired'

type VerifyEmailDocument = {
  req: VerifyEmailReq
  attempts: number
  token: string
  status: VerifyEmailDocumentStatus
} & Flow &
  CreatedDocumentBase
// $ VerifyEmailDocument

// ^ SentEmailDocument
type SentKO = { success: false; error: string }
type SentOK = { success: true; emailId: string }
type SentEmailDocument = {
  sentEmails: SentEmailRecord[]
} & Flow
type SentEmailRecord = (SentKO | SentOK) & {
  email: EmailObj
} & CreatedDocumentBase
// $ SentEmailDocument
