import { AnyProgressOf, ServiceQueue } from '../../lib/queue'
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
    sendVerificationEmailProgress: AnyProgressOf<VerifyEmailJobProgress>
  }
>({
  registerNewAccount: null,
  sendVerificationEmailProgress: null,
})

export const VerifyEmailWF = makeServiceWorkflow<
  VerifyEmailJobProgress,
  {
    verifyAccountEmail: VerifyEmailJobReq
    cancelAccountVerifyEmailJob: null
  }
>({
  cancelAccountVerifyEmailJob: null,
  verifyAccountEmail: null,
})
