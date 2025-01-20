import { env } from './init/env'

if (!env.noBgProc) {
  import('./start/autofill/queue')
}
