import './_test_srv'

import { start } from './_test_req'

setTimeout(() => {
  start(10)
}, 500)
