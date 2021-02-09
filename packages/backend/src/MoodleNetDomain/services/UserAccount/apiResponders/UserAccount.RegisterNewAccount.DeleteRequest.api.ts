import { RegisterNewAccountDeleteRequestApiHandler } from '../apis/UserAccount.RegisterNewAccount.DeleteRequest'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.RegisterNewAccount.DeleteRequest').respond(
  RegisterNewAccountDeleteRequestApiHandler,
)
