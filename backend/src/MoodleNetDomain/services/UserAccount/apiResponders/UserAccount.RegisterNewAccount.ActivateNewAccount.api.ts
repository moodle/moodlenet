import { MoodleNet } from '../../..'
import { ConfirmEmailActivateAccountApiHandler } from '../apis/UserAccount.RegisterNewAccount.ActivateNewAccount'

MoodleNet.api(
  'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount'
).respond(ConfirmEmailActivateAccountApiHandler)
