import type { ProfileGetRpc } from '@moodlenet/web-user/common'
import { useContext, useEffect, useMemo } from 'react'
import type { JiraRequestApprovalButtonProps } from '../../ui/exports/ui.mjs'
import { MyModerationsContext } from '../myModerationsContext.js'

export type JiraApproveButtonHookArg = {
  profileGetRpc: ProfileGetRpc | null | undefined
  isCreator: boolean
}
export function useJiraApproveButtonProps({
  profileGetRpc,
  isCreator,
}: JiraApproveButtonHookArg): JiraRequestApprovalButtonProps | null {
  const { approval } = useContext(MyModerationsContext)
  const refresh = approval.refresh
  useEffect(() => {
    refresh()
  }, [refresh])
  const props = useMemo<JiraRequestApprovalButtonProps | null>(() => {
    if (
      !isCreator ||
      approval.state.type === 'is-publisher' ||
      approval.state.type === 'anonymous' ||
      approval.state.type === 'wait' ||
      !profileGetRpc?.data._key
    ) {
      return null
    }
    return {
      access: {
        isCreator,
        isPublisher: false,
      },
      actions: {
        requestApproval: approval.requestApproval,
      },
      state: {
        isElegibleForApproval: approval.state.canPrompt,
        isWaitingApproval: approval.state.type === 'in-charge',
        showApprovalRequestedSuccessAlert: false,
        minimumResourceAmount: approval.state.minimumResourceAmount,
      },
    }
  }, [approval, isCreator, profileGetRpc?.data._key])
  return props
}
