import { MoodleNet } from '../../..'
import { RegisterNewAccountDeleteRequestApiHandler } from '../apis/UserAccount.RegisterNewAccount.DeleteRequest'

MoodleNet.api('UserAccount.RegisterNewAccount.DeleteRequest').respond(
  RegisterNewAccountDeleteRequestApiHandler
)
