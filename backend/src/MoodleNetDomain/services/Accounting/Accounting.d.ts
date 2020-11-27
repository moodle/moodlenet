import { Api } from '../../../lib/domain/api/types'
import { Event, LookupType } from '../../../lib/domain/event/types'
import { Flow } from '../../../lib/domain/types/path'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type Accounting = {
  Register_New_Account: {
    Request: Api<AccountRequest, {}>
    Email_Confirm_Result: Api<
      LookupType<MoodleNetDomain, 'Email.Verify_Email.Result'>,
      { done: boolean }
    >
    ActivateNewAccount: Api<{ token: string }, {}>
    AccountActivated: Event<{ flow: Flow }>
  }
}

export type AccountRequest = { email: string }
