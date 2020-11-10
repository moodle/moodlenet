import { AnyProgressOf } from '../../lib/queue/types'
import { ServiceQueue } from '../../lib/queue'
import { SendEmailProgress } from '../email/types'
import {
  RegisterNewAccountJobReq,
  RegisterNewAccountProgress,
  VerifyEmailJobProgress,
  VerifyEmailJobReq,
} from './types'
import { AccountingService } from './types/service'

const { makeServiceWorkflow } = ServiceQueue<AccountingService>('accounting')

// export const [enqueueRegisterNewAccount, registerNewAccountWorker] = makeServiceQueue<
//   RegisterNewAccountJobReq,
//   RegisterNewAccountProgress
// >('registerNewAccount')

// export const [enqueueVerifyAccountEmail, verifyAccountEmailWorker] = makeQueue<
//   VerifyEmailJobReq,
//   VerifyEmailJobProgress
// >('verifyAccountEmail')

// export const [enqueueCancelAccountVerifyEmailJob, cancelAccountVerifyEmailJobWorker] = makeQueue<
//   null,
//   VerifyEmailJobProgress
// >('cancelAccountVerifyEmailJob')

export const RegisterNewAccountWF = makeServiceWorkflow<
  RegisterNewAccountProgress,
  {
    registerNewAccount: RegisterNewAccountJobReq
    newRegistrationVerificationEmailProgress: AnyProgressOf<VerifyEmailJobProgress>
  }
>({
  registerNewAccount: null,
  newRegistrationVerificationEmailProgress: null,
})

export const VerifyEmailWF = makeServiceWorkflow<
  VerifyEmailJobProgress,
  {
    verifyAccountEmail: VerifyEmailJobReq
    sendVerificationEmailProgress:
      | AnyProgressOf<SendEmailProgress>
      | AnyProgressOf<VerifyEmailJobProgress, 'Expired' | 'Confirmed'>
  }
>({
  sendVerificationEmailProgress: null,
  verifyAccountEmail: null,
})
