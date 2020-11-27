import { Flow } from '../../../../lib/domain/types/path'
import { Maybe, CreatedDocumentBase } from '../../../../lib/helpers/types'
import { EmailObj, VerifyEmailReq } from '../types'

export interface EmailPersistence {
  storeSentEmail(_: { email: EmailObj; response: SentKO | SentOK; flow: Flow }): Promise<void>
  storeVerifyingEmail(_: { req: VerifyEmailReq; token: string; flow: Flow }): Promise<void>
  getVerifyingEmail(_: { flow: Flow }): Promise<Maybe<VerifyEmailDocument>>
  incrementAttemptVerifyingEmail(_: { flow: Flow }): Promise<Maybe<VerifyEmailDocument>>
  confirmEmail(_: { token: string }): Promise<Maybe<VerifyEmailDocument>>
}

// ^ VerifyEmailDocument
export type VerifyEmailDocumentStatus = 'Verifying' | 'Verified' | 'Expired'

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
type SentEmailDocument = (SentKO | SentOK) & {
  email: EmailObj
} & Flow &
  CreatedDocumentBase
// $ SentEmailDocument
