import '../_test_srv'

import { start } from './_req'

setTimeout(() => {
  start(10)
}, 500)
