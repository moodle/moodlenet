import type { ProfilePagePluginCtx } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import type { JiraRequestApprovalInfoProps } from '../../ui/exports/ui.mjs'
import { useJiraApproveButtonProps } from './JiraApproveButtonHook.mjs'

export type JiraRequestApprovalInfoHookArg = ProfilePagePluginCtx
export function useJiraRequestApprovalInfoProps({
  profileGetRpc,
  isCreator,
}: JiraRequestApprovalInfoHookArg) {
  const buttonProps = useJiraApproveButtonProps({ isCreator, profileGetRpc })
  const props = useMemo<JiraRequestApprovalInfoProps | null>(() => {
    if (!buttonProps) {
      return null
    }
    const props: JiraRequestApprovalInfoProps = {
      isCreator: buttonProps.access.isCreator,
      isElegibleForApproval: buttonProps.state.isElegibleForApproval,
      isWaitingApproval: buttonProps.state.isWaitingApproval,
      isPublisher: buttonProps.access.isPublisher,
    }
    return props
  }, [buttonProps])

  return props
}
