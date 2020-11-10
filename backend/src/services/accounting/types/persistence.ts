import { MNQJobMeta, AnyProgressOf, JobProgressMap } from '../../../lib/queue'
import {
  VerifyEmailJobProgress,
  RegisterNewAccountJobReq,
  RegisterNewAccountProgress,
  VerifyEmailJobReq,
} from './jobs'

export type RecordId = string
export interface AccountingPersistenceImpl {
  saveAccountRegistrationRequestJob(_: AccountRegistrationRequestJobData): Promise<RecordId>
  saveVerifyEmailJob(_: VerifyEmailJobData): Promise<RecordId>
  confirmVerifyEmail(_: { email: string; token: string }): Promise<boolean>
  deleteAccountRegistrationRequest(_: { jobId: string }): Promise<boolean>
  activateAccount(_: { jobId: string }): Promise<boolean>
}
export type AccountRegistrationRequestJobData = {
  jobId: string
  req: RegisterNewAccountJobReq
  progress: AnyProgressOf<JobProgressMap<RegisterNewAccountProgress>>
  confirmEmailJob: MNQJobMeta
}

export type VerifyEmailJobData = {
  jobId: string
  sendEmailJob: MNQJobMeta
  req: VerifyEmailJobReq
  expireDate: Date
  progress: AnyProgressOf<VerifyEmailJobProgress>
}
