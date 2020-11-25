import { Api } from '../../../lib/domain/api/types'
import { Event, EventType } from '../../../lib/domain/event/types'
import { FlowId } from '../../../lib/domain/types/path'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type Accounting = {
  Register_New_Account: {
    Request: Api<AccountRequest, {}>
    Email_Confirm_Result: Api<
      EventType<MoodleNetDomain, 'Email.Verify_Email.Result'>,
      { done: boolean }
    >
    AccountActivated: Event<{ flowId: FlowId }>
  }
}

export type AccountRequest = { email: string; username: string }
