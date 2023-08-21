import type { UserApprovalExposeType } from '../common/expose-def.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<UserApprovalExposeType>({
  rpc: {
    'webapp/-': {
      guard() {
        return true
      },
      async fn() {
        return
      },
    },
  },
})
