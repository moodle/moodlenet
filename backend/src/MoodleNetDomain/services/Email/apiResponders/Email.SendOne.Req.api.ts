import { MoodleNet } from '../../..'
import { SendOneNow } from '../apis/Email.SendOne.Req'

MoodleNet.api('Email.SendOne.SendNow').respond(SendOneNow)
