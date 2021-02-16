import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { SessionGetApiHandler } from '../apis/UserAccount.Session.Get'

api<MoodleNetDomain>()('UserAccount.Session.Get').respond(SessionGetApiHandler)
