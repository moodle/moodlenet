require('../../dotenv.js')

import { newFlow } from '../lib/domain/helpers'
import { MoodleNet } from '../MoodleNetDomain'

for (let i = 0; i < 1; i++) {
  MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.Request',
    req: { email: 'alessandro.giansanti@gmail.com', username: `alec ${i}` },
    flow: newFlow(),
    opts: { justEnqueue: true },
  }).then((_) => console.log('_TEST_THEN', _))
}
