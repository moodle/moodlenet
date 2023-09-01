import type { ProfileGetRpc } from '@moodlenet/web-user/common'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { RpcApprovalRequestState } from '../../../common/types.mjs'
import type { JiraRequestApprovalButtonProps } from '../../ui/exports/ui.mjs'
import { shell } from '../shell.mjs'

export type JiraApproveButtonHookArg = {
  profileGetRpc: ProfileGetRpc | null | undefined
  isCreator: boolean
}
export function useJiraApproveButtonProps({
  profileGetRpc,
  isCreator,
}: JiraApproveButtonHookArg): JiraRequestApprovalButtonProps | null {
  const [rpcApprovalRequestState, setRpcApprovalRequestState] = useState<RpcApprovalRequestState>()
  const requestApproval = useCallback(() => {
    shell.rpc.me('webapp/user-approval/request-approval')().then(setRpcApprovalRequestState)
  }, [])
  useEffect(() => {
    if (!profileGetRpc || profileGetRpc.isPublisher) {
      return
    }
    shell.rpc.me('webapp/user-approval/get-my-status')().then(setRpcApprovalRequestState)
  }, [profileGetRpc])
  return useMemo<JiraRequestApprovalButtonProps | null>(() => {
    if (!(rpcApprovalRequestState && profileGetRpc)) {
      return null
    }
    return {
      access: {
        isCreator,
        isPublisher: profileGetRpc.isPublisher,
      },
      actions: {
        requestApproval,
      },
      state: {
        isElegibleForApproval: rpcApprovalRequestState.canPrompt,
        isWaitingApproval: rpcApprovalRequestState.type === 'in-charge',
        showApprovalRequestedSuccessAlert: false,
        minimumResourceAmount: rpcApprovalRequestState.minimumResourceAmount,
      },
    }
  }, [isCreator, profileGetRpc, requestApproval, rpcApprovalRequestState])
}
