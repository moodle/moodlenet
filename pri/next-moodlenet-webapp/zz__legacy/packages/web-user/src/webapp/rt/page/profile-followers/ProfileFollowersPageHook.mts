import type { AddOnMap } from '@moodlenet/core/lib'
import type { MainColumItem } from '@moodlenet/react-app/ui'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { Profile } from '../../../../common/types.mjs'
import type { FollowersProps } from '../../../ui/exports/ui.mjs'
import { useMyProfileContext } from '../../exports.mjs'
import { shell } from '../../shell.mjs'

export type BrowserPluginItem = Omit<MainColumItem, 'key'>
export const ProfileFollowersPagePlugin = createPlugin<
  {
    browserItems_mainColumnItems: AddOnMap<BrowserPluginItem>
  },
  {
    profileKey: string
  }
>()

export function useProfileFollowersPageProps({
  profileKey,
}: {
  profileKey: string
}): FollowersProps | undefined | null {
  const myCtx = useMyProfileContext()
  const myProfile = myCtx?.myProfile
  const isMe = myProfile ? myProfile._key === profileKey : false
  const mainLayoutProps = useMainLayoutProps()
  const plugins = ProfileFollowersPagePlugin.usePluginHooks({ profileKey })
  const [profile, setProfile] = useState<Profile | undefined | null>(isMe ? myProfile : undefined)
  useEffect(() => {
    if (isMe) {
      return
    }
    shell.rpc
      .me('webapp/profile/:_key/get')(
        void 0,
        { _key: profileKey },
        { ownContributionListLimit: '0' },
      )
      .then(profileRPC => setProfile(profileRPC && profileRPC.data))
  }, [profileKey, isMe])
  const followersProps = useMemo<FollowersProps | undefined | null>(() => {
    if (!profile) {
      return profile
    }
    const props: FollowersProps = {
      browserProps: { mainColumnItems: plugins.getKeyedAddons('browserItems_mainColumnItems') },
      mainLayoutProps,
      profileName: profile.displayName,
      isCreator: isMe,
    }
    return props
  }, [isMe, mainLayoutProps, plugins, profile])

  return followersProps
}
