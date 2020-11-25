require('../../dotenv.js')

import { MoodleNet } from '../MoodleNetDomain'

MoodleNet.api
  .call({
    api: 'Accounting.Register_New_Account.Request',
    req: { email: 'alessandro.giansanti@gmail.com', username: 'alec' },
  })
  .then((_) => console.log('_TEST_THEN', _))
