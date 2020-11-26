import { EmailObj } from '.'
import { Flow } from '../../../../lib/domain/types/path'
import { VerifyEmailReq } from './types'

export interface EmailPersistence {
  storeSentEmail(_: { email: EmailObj; emailId: string; flow: Flow }): Promise<void>
  storeVerifyingEmail(_: { req: VerifyEmailReq; token: string; flow: Flow }): Promise<void>
  getVerifyingEmail(_: { flow: Flow }): Promise<VerifyEmailDocument | undefined>
  incAttemptVerifyingEmail(_: { flow: Flow }): Promise<VerifyEmailDocument | undefined>
  confirmEmail(_: { token: string }): Promise<VerifyEmailDocument | undefined>
}

type VerifyEmailDocument = { req: VerifyEmailReq; attempts: number; token: string } & Flow
type SentEmailDocument = { email: EmailObj; at: Date; emailId: string } & Flow
