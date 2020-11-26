require('../../dotenv.js')

import { MoodleNet } from '../MoodleNetDomain'

const token = '30c9e792-a977-419c-9077-09c4eba4d10b|e3c521aa-f4be-461d-a1d9-6de3bc313cfc'
MoodleNet.callApi({
  api: 'Email.Verify_Email.Confirm_Email',
  req: { token },
}).then((_) => console.log('_TEST_THEN Confirm_Email', _))
