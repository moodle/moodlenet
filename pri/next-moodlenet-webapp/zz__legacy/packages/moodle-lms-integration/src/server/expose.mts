import { RpcStatus } from '@moodlenet/core'
import type { MoodleLMSExposeType } from '../common/expose-def.mjs'
import { addMyLmsSiteTarget, getCurrentUserConfigs } from './lib.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<MoodleLMSExposeType>({
  rpc: {
    'webapp/get-my-config': {
      guard() {
        return true
      },
      async fn() {
        const currentUserConfigs = await getCurrentUserConfigs()
        // if (currentUserConfigs === false) {
        //   throw RpcStatus('Unauthorized')
        // }

        return (
          currentUserConfigs || {
            sites: [],
          }
        )
      },
    },
    'webapp/add-my-lms-site-target': {
      guard() {
        return true
      },
      async fn({ siteTarget }) {
        const res = await addMyLmsSiteTarget({ siteTarget })
        if (res === false) {
          throw RpcStatus('Unauthorized')
        }
        return res
      },
    },
  },
})
