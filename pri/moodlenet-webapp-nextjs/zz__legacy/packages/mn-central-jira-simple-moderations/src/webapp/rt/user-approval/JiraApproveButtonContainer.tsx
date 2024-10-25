import type { ProfilePagePluginCtx } from '@moodlenet/web-user/webapp'
import { JiraRequestApprovalButton } from '../../ui/exports/ui.mjs'
import { useJiraApproveButtonProps } from './JiraApproveButtonHook.mjs'

export type JiraApproveButtonContainerProps = ProfilePagePluginCtx
export function JiraApproveButtonContainer({
  profileGetRpc,
  isCreator,
}: JiraApproveButtonContainerProps) {
  const props = useJiraApproveButtonProps({ isCreator, profileGetRpc })
  if (!props) {
    return null
  }

  return <JiraRequestApprovalButton {...props} />
}
