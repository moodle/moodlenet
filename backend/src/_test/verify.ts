require('../../dotenv.js')

import { MoodleNet } from '../MoodleNetDomain'

const token = '49e69650-9f77-47ca-ba59-42f24690c5d1|48d2170a-9a67-4192-9051-a65b813f5f48'
MoodleNet.callApi({
  api: 'Email.Verify_Email.Confirm_Email',
  req: { token },
}).then((_) => console.log('_TEST_THEN Confirm_Email', _))
