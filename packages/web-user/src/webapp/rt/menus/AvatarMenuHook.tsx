import { href } from '@moodlenet/react-app/common'
import { createHookPlugin } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import type {
  AvatarMenuItem,
  AvatarMenuProps,
} from '../../ui/components/molecules/AvatarMenu/AvatarMenu.js'
import { AuthCtx } from '../context/AuthContext.js'

export type AvatarMenuPluginItem = Omit<AvatarMenuItem, 'key'>

export const AvatarMenuPlugins = createHookPlugin<{
  menuItems: AvatarMenuPluginItem
}>({ menuItems: null })

export function useAvatarMenuProps(): AvatarMenuProps {
  const authCtx = useContext(AuthCtx)

  const hasProfile = !!authCtx.clientSessionData?.myProfile
  const avatarUrl = authCtx.clientSessionData?.userDisplay?.avatarUrl
  const isAdmin = !!authCtx.clientSessionData?.isAdmin

  const [addons] = AvatarMenuPlugins.useHookPlugin()
  const avatarMenuProps = useMemo<AvatarMenuProps>(() => {
    const avatarMenuProps: AvatarMenuProps = {
      avatarUrl,
      menuItems: addons.menuItems,
      followingMenuProps: hasProfile ? { followingHref: href('/following') } : null,
      bookmarksMenuProps: hasProfile ? { bookmarksHref: href('/bookmarks') } : null,
      profileMenuProps: hasProfile ? { profileHref: href('/my-profile') } : null,
      signoutMenuProps: { signout: authCtx.logout },
      userSettingsMenuProps: hasProfile ? { settingsHref: href('/settings') } : null,
      adminSettingsMenuProps: isAdmin ? { settingsHref: href('/admin') } : null,
    }
    return avatarMenuProps
  }, [addons.menuItems, authCtx.logout, avatarUrl, hasProfile, isAdmin])
  return avatarMenuProps
}
