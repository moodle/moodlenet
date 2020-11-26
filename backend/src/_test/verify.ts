require('../../dotenv.js')

import { MoodleNet } from '../MoodleNetDomain'

const token = '8c89e923-5abe-4be6-8dbe-1e3dc72882ba|aca1e4da-c68e-433f-a7bf-0cdb3651eb80'
MoodleNet.api
  .call({
    api: 'Email.Verify_Email.Confirm_Email',
    req: { token },
  })
  .then((_) => console.log('_TEST_THEN Confirm_Email', _))
