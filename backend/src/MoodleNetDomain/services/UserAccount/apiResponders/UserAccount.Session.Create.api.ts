import { MoodleNet } from '../../..'
import { SessionCreateApiHandler } from '../apis/UserAccount.Session.Create'

MoodleNet.api('UserAccount.Session.Create').respond(SessionCreateApiHandler)
