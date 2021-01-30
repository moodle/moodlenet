import { MoodleNet } from '../../..'
import { ChangePasswordApiHandler } from '../apis/UserAccount.ChangePassword'

MoodleNet.api('UserAccount.ChangePassword').respond(ChangePasswordApiHandler)
