import { SessionCreateApiHandler } from '../apis/UserAccount.Session.Create'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.Session.Create').respond(
  SessionCreateApiHandler
)
