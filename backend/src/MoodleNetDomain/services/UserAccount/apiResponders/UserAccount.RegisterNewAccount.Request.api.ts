import { MoodleNet } from '../../..'
import { RegisterNewAccountRequestApiHandler } from '../apis/UserAccount.RegisterNewAccount.Request'

MoodleNet.api('UserAccount.RegisterNewAccount.Request').respond(
  RegisterNewAccountRequestApiHandler
)
