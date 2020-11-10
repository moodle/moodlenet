import { MNQJobMeta, AnyProgressOf } from '../../../lib/queue/types'
import {
  VerifyEmailJobProgress,
  RegisterNewAccountJobReq,
  RegisterNewAccountProgress,
  VerifyEmailJobReq,
} from './jobs'

export type RecordId = string
export interface AccountingPersistenceImpl {
  saveAccountRegistrationRequestJob(_: AccountRegistrationRequestJobData): Promise<MNQJobMeta>
  saveVerifyEmailJob(_: VerifyEmailJobData): Promise<MNQJobMeta>
  updateVerifyEmailProgress(_: {
    jobId: string
    progress: VerifyEmailJobData['progress']
  }): Promise<MNQJobMeta | null>
  confirmVerifyEmail(_: { email: string; token: string }): Promise<MNQJobMeta | null>
  deleteAccountRegistrationRequest(_: { jobId: string }): Promise<MNQJobMeta | null>
  activateAccount(_: { jobId: string }): Promise<MNQJobMeta | null>
}

export type AccountRegistrationRequestJobData = {
  jobId: string
  req: RegisterNewAccountJobReq
  progress: AnyProgressOf<RegisterNewAccountProgress>
  confirmEmailJob: MNQJobMeta
}

export type VerifyEmailJobData = {
  jobId: string
  sendEmailJob: MNQJobMeta
  req: VerifyEmailJobReq
  expireDate: Date
  progress: AnyProgressOf<VerifyEmailJobProgress>
}
