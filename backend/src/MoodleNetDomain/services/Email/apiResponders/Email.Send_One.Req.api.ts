import { MoodleNet } from '../../..'
import { Send_One_Now } from '../apis/Email.Send_One.Req'

Send_One_Now().then((handler) => {
  MoodleNet.respondApi({
    api: 'Email.Send_One.Send_Now',
    handler,
  })
})
