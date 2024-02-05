import type { MNMExposeType } from '../common/expose-def.mjs'
import type { RpcApprovalRequestState } from '../common/types.mjs'
import type { UserRequestState } from './services.mjs'
import {
  getServiceConfigs,
  getUserRequestState_currentUser,
  promptReopenOrCreateJiraIssue_currentUser,
} from './services.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<MNMExposeType>({
  rpc: {
    'webapp/user-approval/get-my-status': {
      guard() {
        return true
      },
      async fn() {
        const userRequestState = await getUserRequestState_currentUser()
        return userRequestState2RpcApprovalRequestState(userRequestState)
      },
    },
    'webapp/user-approval/request-approval': {
      guard() {
        return true
      },
      async fn() {
        const userRequestState = await promptReopenOrCreateJiraIssue_currentUser()
        return userRequestState2RpcApprovalRequestState(userRequestState)
      },
    },
  },
})

async function userRequestState2RpcApprovalRequestState(
  userRequestState: UserRequestState | null,
): Promise<RpcApprovalRequestState> {
  const serviceConfigs = await getServiceConfigs()
  const minimumResourceAmount = serviceConfigs.publishingApproval.resourceAmount

  if (!userRequestState) {
    return {
      type: 'no-request',
      canPrompt: false,
      minimumResourceAmount,
    }
  } else if (userRequestState.type == 'no-request') {
    return {
      type: 'no-request',
      canPrompt: userRequestState.isEligible,
      minimumResourceAmount,
    }
  } else if (userRequestState.type == 'in-charge') {
    return {
      type: 'in-charge',
      canPrompt: userRequestState.canPrompt,
      minimumResourceAmount,
    }
  }
  throw new TypeError('never')
}
