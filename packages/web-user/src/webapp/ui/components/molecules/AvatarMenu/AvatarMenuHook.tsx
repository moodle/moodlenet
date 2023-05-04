import { href } from '@moodlenet/react-app/common'
import { useContext, useMemo } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import type { AvatarMenuItem, AvatarMenuProps } from './AvatarMenu.js'

export function useAvatarMenuProps(): AvatarMenuProps {
  const mainCtx = useContext(MainContext)
  const authCtx = useContext(AuthCtx)

  const menuEntries = mainCtx.registries.avatarMenuItems.registry.entries
  const menuItems = useMemo<AvatarMenuItem[]>(() => {
    const regAvatarMenuItems = menuEntries.map<AvatarMenuItem>(({ item, pkgId }, index) => {
      const avatarMenuItem: AvatarMenuItem = {
        ...item,
        key: `${pkgId.name}:${index}`,
      }
      return avatarMenuItem
    })
    return regAvatarMenuItems
  }, [menuEntries])

  const hasProfile = !!authCtx.clientSessionData?.myProfile
  const avatarUrl = authCtx.clientSessionData?.userDisplay?.avatarUrl
  const isAdmin = !!authCtx.clientSessionData?.isAdmin

  const avatarMenuProps = useMemo<AvatarMenuProps>(() => {
    const avatarMenuProps: AvatarMenuProps = {
      avatarUrl,
      menuItems,
      followingMenuProps: hasProfile ? { followingHref: href('/following') } : null,
      bookmarksMenuProps: hasProfile ? { bookmarksHref: href('/bookmarks') } : null,
      profileMenuProps: hasProfile ? { profileHref: href('/my-profile') } : null,
      signoutMenuProps: { signout: authCtx.logout },
      settingsMenuProps: isAdmin ? { settingsHref: href('/settings') } : null,
    }
    return avatarMenuProps
  }, [authCtx.logout, avatarUrl, hasProfile, isAdmin, menuItems])
  return avatarMenuProps
}
