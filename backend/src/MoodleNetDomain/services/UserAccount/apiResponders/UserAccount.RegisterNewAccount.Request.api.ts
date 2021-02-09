import { RegisterNewAccountRequestApiHandler } from '../apis/UserAccount.RegisterNewAccount.Request'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.RegisterNewAccount.Request').respond(RegisterNewAccountRequestApiHandler)
