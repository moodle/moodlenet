import { SessionByEmailApiHandler } from '../apis/UserAccount.Session.ByEmail'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.Session.ByEmail').respond(
  SessionByEmailApiHandler
)
