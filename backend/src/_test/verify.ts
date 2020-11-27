require('../../dotenv.js')

import { newFlow } from '../lib/domain/helpers'
import { MoodleNet } from '../MoodleNetDomain'

const token = '827d1d6f-1280-43de-9b16-04dff50fa843|db2ad9f5-254f-4198-b064-ba380f9ce7ec'
MoodleNet.callApi({
  api: 'Email.Verify_Email.Confirm_Email',
  req: { token },
  flow: newFlow(),
}).then((_) => console.log('_TEST_THEN Confirm_Email', _))
