import './_test_srv'

import { start } from './_test_req'

setTimeout(() => {
  start(2)
}, 500)
