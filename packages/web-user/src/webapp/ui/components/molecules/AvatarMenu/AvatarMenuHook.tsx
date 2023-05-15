import { href } from '@moodlenet/react-app/common'
import { usePkgAddOns } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import type { AvatarMenuItem, AvatarMenuProps } from './AvatarMenu.js'

export type AvatarMenuPluginItem = Omit<AvatarMenuItem, 'key'>

export function useAvatarMenuProps(): AvatarMenuProps {
  const authCtx = useContext(AuthCtx)

  const [avatarMenuItems /*,registerAvatarMenuItems */] =
    usePkgAddOns<AvatarMenuPluginItem>('AvatarMenuPlugin')
  const menuItems = useMemo<AvatarMenuItem[]>(() => {
    const regAvatarMenuItems = avatarMenuItems.map<AvatarMenuItem>(
      ({ addOn: { Component, className }, key }) => {
        const avatarMenuItem: AvatarMenuItem = {
          Component,
          key,
          className,
        }
        return avatarMenuItem
      },
    )
    return regAvatarMenuItems
  }, [avatarMenuItems])

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
