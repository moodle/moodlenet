import { Api } from '../../../lib/domain/api/types'
import { Event, LookupType } from '../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type Accounting = {
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
  AccountActivated: Event<{ requestFlowKey: string }> //TODO: should be flow obj .. change allaround .. really ? why ?
}

export type AccountRequest = { email: string }
