import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import { createPlugin } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import {
  getProfileFollowingRoutePath,
  getProfileHomePageRoutePath,
} from '../../../common/webapp-routes.mjs'
import type {
  AvatarMenuItem,
  AvatarMenuProps,
} from '../../ui/components/molecules/AvatarMenu/AvatarMenu.js'
import { AuthCtx } from '../context/AuthContext.js'

export type AvatarMenuPluginItem = Omit<AvatarMenuItem, 'key'>

export const AvatarMenuPlugins = createPlugin<{
  menuItems: AddOnMap<AvatarMenuPluginItem>
}>()

export function useAvatarMenuProps(): AvatarMenuProps {
  const authCtx = useContext(AuthCtx)

  const hasProfile = authCtx.clientSessionData?.myProfile
  const avatarUrl = authCtx.clientSessionData?.userDisplay?.avatarUrl
  const isAdmin = !!authCtx.clientSessionData?.isAdmin

  const myProfileHref = hasProfile
    ? href(
        getProfileHomePageRoutePath({ _key: hasProfile._key, displayName: hasProfile.displayName }),
      )
    : href('/')
  const plugins = AvatarMenuPlugins.usePluginHooks()
  const avatarMenuProps = useMemo<AvatarMenuProps>(() => {
    const avatarMenuProps: AvatarMenuProps = {
      avatarUrl,
      menuItems: plugins.getKeyedAddons('menuItems'),
      followingMenuProps: hasProfile
        ? {
            followingHref: href(
              getProfileFollowingRoutePath({
                key: hasProfile._key,
                displayName: hasProfile.displayName,
              }),
            ),
          }
        : null,
      bookmarksMenuProps: hasProfile ? { bookmarksHref: href('/bookmarks') } : null,
      profileMenuProps: hasProfile ? { profileHref: myProfileHref } : null,
      logoutMenuProps: { logout: authCtx.logout },
      userSettingsMenuProps: hasProfile ? { settingsHref: href('/settings') } : null,
      adminSettingsMenuProps: isAdmin ? { settingsHref: href('/admin') } : null,
    }
    return avatarMenuProps
  }, [plugins, authCtx.logout, avatarUrl, hasProfile, isAdmin, myProfileHref])
  return avatarMenuProps
}
