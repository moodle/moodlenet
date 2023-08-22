import type { UserApprovalExposeType } from '../common/expose-def.mjs'
import {
  getUserRequestState_currentUser,
  promptReopenOrCreateJiraIssue_currentUser,
} from './services.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<UserApprovalExposeType>({
  rpc: {
    'webapp/user-approval/get-my-status': {
      guard() {
        return true
      },
      async fn() {
        const userRequestState = await getUserRequestState_currentUser()
        if (!userRequestState) return { type: 'none' }
        return {
          type: 'in-charge',
          canPrompt: userRequestState.canPrompt,
        }
      },
    },
    'webapp/user-approval/request-approval': {
      guard() {
        return true
      },
      async fn() {
        const response = await promptReopenOrCreateJiraIssue_currentUser()
        if (!response) return response
        return true
      },
    },
  },
})
