require('../../dotenv.js')

import { MoodleNet } from '../MoodleNetDomain'

for (let i = 0; i < 10000; i++) {
  MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.Request',
    req: { email: 'alessandro.giansanti@gmail.com', username: 'alec' },
  }).then((_) => console.log('_TEST_THEN', _))
}
