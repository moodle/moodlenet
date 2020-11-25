require('../../dotenv.js')

import { MoodleNet } from '../MoodleNetDomain'

MoodleNet.publish({
  target: ['Accounting.Register_New_Account.Request'],
  payload: { email: 'alessandro.giansanti@gmail.com', username: 'alec' },
  replyCb: console.log,
})
