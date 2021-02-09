import { SendOneNow } from '../apis/Email.SendOne.Req'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('Email.SendOne.SendNow').respond(SendOneNow)
