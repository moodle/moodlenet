import type { MainAppPluginHookResult } from '@moodlenet/react-app/webapp'
import { registerMainAppPluginHook } from '@moodlenet/react-app/webapp'
import type { ProfilePagePluginMap } from '@moodlenet/web-user/webapp'
import { ProfilePagePlugins } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import { MainWrapper } from './MainWrapper'
import { JiraApprovalInfoContainer } from './user-approval/JiraApprovalInfoContainer'
import { JiraApproveButtonContainer } from './user-approval/JiraApproveButtonContainer'

registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

ProfilePagePlugins.register(function useProfilePagePlugin({
  profileGetRpc,
  isCreator,
  profileKey,
}) {
  return useMemo<ProfilePagePluginMap>(() => {
    if (!profileGetRpc || profileGetRpc.isPublisher || !isCreator) return {}
    const JiraApproveButton = () => (
      <JiraApproveButtonContainer
        isCreator={isCreator}
        profileGetRpc={profileGetRpc}
        profileKey={profileKey}
      />
    )
    const JiraApprovalInfo = () => (
      <JiraApprovalInfoContainer profilePagePluginCtx={{ isCreator, profileGetRpc, profileKey }} />
    )
    return {
      main_mainColumnItems: {
        approvalInfo: {
          Item: JiraApprovalInfo,
        },
      },
      main_footerItems: {
        approvalButton: {
          Item: JiraApproveButton,
        },
      },
    }
  }, [isCreator, profileGetRpc, profileKey])
})
