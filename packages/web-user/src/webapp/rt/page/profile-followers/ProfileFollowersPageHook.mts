import type { AddOnMap } from '@moodlenet/core/lib'
import type { MainColumItem } from '@moodlenet/react-app/ui'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { FollowersProps } from '../../../ui/exports/ui.mjs'
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
  const mainLayoutProps = useMainLayoutProps()
  const plugins = ProfileFollowersPagePlugin.usePluginHooks({ profileKey })
  const [profileName, setProfileName] = useState<string | null>()
  useEffect(() => {
    shell.rpc.me['webapp/profile/get']({ _key: profileKey }).then(profile => {
      setProfileName(profile?.data.displayName)
    })
  }, [profileKey])
  const followersProps = useMemo<FollowersProps | undefined | null>(() => {
    if (typeof profileName !== 'string') {
      return profileName
    }
    const props: FollowersProps = {
      browserProps: { mainColumnItems: plugins.getKeyedAddons('browserItems_mainColumnItems') },
      mainLayoutProps,
      profileName,
    }
    return props
  }, [mainLayoutProps, plugins, profileName])

  return followersProps
}
