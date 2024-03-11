import { env } from './init/env.mjs'

if (!env.noBgProc) {
  import('./start/autofill/queue.mjs')
}
