import { MoodleNet } from '../../..'
import { SessionByEmailApiHandler } from '../apis/UserAccount.Session.ByEmail'

MoodleNet.api('UserAccount.Session.ByEmail').respond(SessionByEmailApiHandler)
