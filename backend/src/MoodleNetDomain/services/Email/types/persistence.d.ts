import { EmailObj } from '.'
import { FlowId } from '../../../../lib/domain/types/path'
import { VerifyEmailReq } from './types'

export interface EmailPersistence {
  storeSentEmail(_: { email: EmailObj; emailId: string; flowId: FlowId }): Promise<void>
  storeVerifyingEmail(_: { req: VerifyEmailReq; token: string; flowId: FlowId }): Promise<void>
  getVerifyingEmail(_: { flowId: FlowId }): Promise<VerifyEmailDocument | undefined>
  incAttemptVerifyingEmail(_: { flowId: FlowId }): Promise<VerifyEmailDocument | undefined>
}

type VerifyEmailDocument = { req: VerifyEmailReq; attempts: number; token: string } & FlowId
type SentEmailDocument = { email: EmailObj; at: Date; emailId: string } & FlowId
