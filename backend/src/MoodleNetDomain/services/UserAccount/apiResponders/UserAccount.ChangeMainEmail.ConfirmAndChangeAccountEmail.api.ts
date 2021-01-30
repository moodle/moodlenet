import { MoodleNet } from '../../..'
import { ConfirmAndChangeAccountEmailHandler } from '../apis/UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'

MoodleNet.api(
  'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
).respond(ConfirmAndChangeAccountEmailHandler)
