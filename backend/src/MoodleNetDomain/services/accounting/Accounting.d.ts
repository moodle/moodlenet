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
    NewAccountActivated: Event<{ requestFlowKey: string }>
  }
  Change_Main_Email: {
    Request: Api<ChangeAccountEmailRequest, { success: true } | { success: false; reason: string }>
    Email_Confirm_Result: Api<
      LookupType<MoodleNetDomain, 'Email.Verify_Email.Result'>,
      { done: boolean }
    >
    AccountEmailChanged: Event<{ username: string; newEmail: string; oldEmail: string }>
  }
  Temp_Email_Session: Api<
    { username: string; email: string },
    { success: true } | { success: false; reason: string }
  >
  Change_Password: Api<
    { username: string; newPassword: string },
    { success: true } | { success: false; reason: string }
  >

  Session: {
    Login: Api<{ username: string; password: string }, { jwt: string | null }>
    AccountLoggedIn: Event<{ username: string; jwt: string }>
  }
}

export type AccountRequest = { email: string }
export type ChangeAccountEmailRequest = { username: string; newEmail: string }
