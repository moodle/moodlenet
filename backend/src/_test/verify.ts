require('../../dotenv.js')

import { MoodleNet } from '../MoodleNetDomain'

const token = '144e3dc4-9ac2-4a40-b51c-75372cd7bfc1|9327e0b9-eb2b-4bf3-a058-e2bca8e43d1a'
MoodleNet.callApi({
  api: 'Email.Verify_Email.Confirm_Email',
  req: { token },
}).then((_) => console.log('_TEST_THEN Confirm_Email', _))
