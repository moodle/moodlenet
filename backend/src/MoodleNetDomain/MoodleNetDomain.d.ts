import { Api } from '../lib/domain/api/types'
import { LookupType, Event } from '../lib/domain/event/types'
import { Flow } from '../lib/domain/types/path'
import { EmailObj, VerifyEmailReq } from './services/Email/types'

export type MoodleNetDomain = {
  Accounting: {
    Register_New_Account: {
      Request: Api<AccountRequest, { success: true } | { success: false; reason: string }>
      Email_Confirm_Result: Api<
        LookupType<MoodleNetDomain, 'Email.Verify_Email.Result'>,
        { done: boolean }
      >
      ActivateNewAccount: Api<
        { requestFlowKey: string; password: string; username: string },
        { success: true } | { success: false; reason: string }
      >
    }
    AccountActivated: Event<{ requestFlowKey: string }>
  }

  Email: {
    Send_One: {
      Req: Api<
        { emailObj: EmailObj },
        { success: true; emailId: string } | { error: string; success: false }
      >
      SentEmail: Event<{ success: true; emailId: string } | { error: string; success: false }>
    }
    Verify_Email: {
      Req: Api<VerifyEmailReq, {}>
      Attempt_Send: Api<{}, { success: true } | { error: string; success: false }>
      Confirm_Email: Api<
        { token: string },
        { success: true; flow: Flow } | { error: string; success: false }
      >
      Result: Event<{ email: string } & ({ success: true } | { error: string; success: false })>
    }
  }
}

export type AccountRequest = { email: string }
