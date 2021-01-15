import { MoodleNet } from '../../..'
import { SendOneNow } from '../apis/Email.SendOne.Req'

SendOneNow().then((handler) => {
  MoodleNet.respondApi({
    api: 'Email.SendOne.SendNow',
    handler,
  })
})
