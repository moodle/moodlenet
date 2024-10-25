import type { ProfilePagePluginCtx } from '@moodlenet/web-user/webapp'
import { JiraRequestApprovalInfo } from '../../ui/exports/ui.mjs'
import { useJiraRequestApprovalInfoProps } from './JiraApprovalInfoHook.mjs'

export type JiraApprovalInfoContainerProps = { profilePagePluginCtx: ProfilePagePluginCtx }
export function JiraApprovalInfoContainer({
  profilePagePluginCtx: { profileGetRpc, isCreator, profileKey },
}: JiraApprovalInfoContainerProps) {
  const props = useJiraRequestApprovalInfoProps({
    profileGetRpc,
    isCreator,
    profileKey,
  })

  return props && <JiraRequestApprovalInfo {...props} />
}
