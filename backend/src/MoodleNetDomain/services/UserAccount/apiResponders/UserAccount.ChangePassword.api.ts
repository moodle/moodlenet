import { ChangePasswordApiHandler } from '../apis/UserAccount.ChangePassword'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.ChangePassword').respond(
  ChangePasswordApiHandler
)
