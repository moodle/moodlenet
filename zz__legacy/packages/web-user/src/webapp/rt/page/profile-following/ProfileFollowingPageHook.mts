import type { AddOnMap } from '@moodlenet/core/lib'
import type { MainColumItem } from '@moodlenet/react-app/ui'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { ProfileGetRpc } from '../../../../common/types.mjs'
import type { FollowingProps } from '../../../ui/exports/ui.mjs'
import { useMyProfileContext } from '../../exports.mjs'
import { shell } from '../../shell.mjs'

export type BrowserPluginItem = Omit<MainColumItem, 'key'>
export const FollowingPagePlugin = createPlugin<
  {
    browserItems: AddOnMap<BrowserPluginItem>
  },
  { profileKey: string }
>()

export function useFollowingPageProps({
  profileKey,
}: {
  profileKey: string
}): FollowingProps | undefined | null {
  const myCtx = useMyProfileContext()
  const mainLayoutProps = useMainLayoutProps()
  const plugins = FollowingPagePlugin.usePluginHooks({ profileKey })
  const [profile, setProfile] = useState<ProfileGetRpc | null>()
  useEffect(() => {
    shell.rpc
      .me('webapp/profile/:_key/get')(
        void 0,
        { _key: profileKey },
        { ownContributionListLimit: '0' },
      )
      .then(setProfile)
  }, [profileKey])
  const followingProps = useMemo<FollowingProps | null | undefined>(() => {
    if (!profile) {
      return profile
    }
    const props: FollowingProps = {
      browserProps: { mainColumnItems: plugins.getKeyedAddons('browserItems') },
      mainLayoutProps,
      isCreator: myCtx ? myCtx.myProfile._key === profileKey : false,
      profileName: profile.data.displayName,
    }
    return props
  }, [profile, plugins, mainLayoutProps, myCtx, profileKey])
  return followingProps
}
