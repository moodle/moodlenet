import { Topic, TopicOf } from '../../../lib/domain/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type Accounting = {
  Register_New_Account_Request: Topic<AccountRequest>
  New_Account_Email_Confirm_Result: TopicOf<MoodleNetDomain, 'Email.Verify_Email_Result'>
}

export type AccountRequest = { email: string; username: string }
