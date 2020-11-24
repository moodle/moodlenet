import { Topic, TopicOf } from '../../../lib/domain/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type Accounting = {
  Register_New_Account: {
    Request: Topic<AccountRequest>
    Email_Confirm_Result: TopicOf<MoodleNetDomain, 'Email.Verify_Email.Result'>
    AccountActivated: Topic<{ accountKey: string }>
  }
}

export type AccountRequest = { email: string; username: string }
