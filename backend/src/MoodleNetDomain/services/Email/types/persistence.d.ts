import { EmailObj } from '.'
import { VerifyEmailReq } from './types'

export type DocumentKey = string
export interface EmailPersistence {
  storeSentEmail(_: { email: EmailObj; emailId: string }): Promise<DocumentKey>
  storeVerifyingEmail(_: { req: VerifyEmailReq }): Promise<DocumentKey>
  getVerifyingEmail(_: { key: string }): Promise<VerifyEmailDocument | undefined>
  incAttemptVerifyingEmail(_: { key: string }): Promise<VerifyEmailDocument | undefined>
}

type VerifyEmailDocument = { req: VerifyEmailReq; attempts: number }
type SentEmailDocument = { email: EmailObj; at: Date; emailId: string }
