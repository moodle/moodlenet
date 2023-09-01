import type { ProfilePagePluginMap } from '@moodlenet/web-user/webapp'
import { ProfilePagePlugins } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
// import { MainWrapper } from './MainWrapper.-tsx'
import { JiraApproveButtonContainer } from './user-approval/JiraApproveButtonContainer.js'

// registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

ProfilePagePlugins.register(function useProfilePagePlugin({
  profileGetRpc,
  isCreator,
  profileKey,
}) {
  return useMemo<ProfilePagePluginMap>(() => {
    if (!profileGetRpc) return {}
    const Item = () => (
      <JiraApproveButtonContainer
        isCreator={isCreator}
        profileGetRpc={profileGetRpc}
        profileKey={profileKey}
      />
    )
    return {
      main_footerItems: {
        approval: {
          Item,
        },
      },
    }
  }, [isCreator, profileGetRpc, profileKey])
})
