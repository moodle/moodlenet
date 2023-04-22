import { href } from '@moodlenet/react-app/common'
import { useContext, useMemo } from 'react'
import { getProfileHomePageRoutePath } from '../../../../../common/webapp-routes.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import { AvatarMenuItem, AvatarMenuProps } from './AvatarMenu.js'

export function useAvatarMenuProps(): AvatarMenuProps {
  const mainCtx = useContext(MainContext)
  const authCtx = useContext(AuthCtx)

  const menuEntries = mainCtx.registries.avatarMenuItems.registry.entries
  const menuItems = useMemo<AvatarMenuItem[]>(() => {
    if (!authCtx.clientSessionData) {
      return []
    }
    const regAvatarMenuItems = menuEntries.map<AvatarMenuItem>(({ item, pkgId }, index) => {
      const avatarMenuItem: AvatarMenuItem = {
        ...item,
        key: `${pkgId.name}:${index}`,
      }
      return avatarMenuItem
    })

    const avatarMenuItems: AvatarMenuItem[] = [
      {
        Icon: '',
        // Icon: ExitToApp,
        text: 'Log out',
        key: 'logOutIdx',
        onClick() {
          authCtx.logout()
        },
      },
    ]

    const myProfile = authCtx.clientSessionData.myProfile
    if (myProfile) {
      avatarMenuItems.push({
        Icon: '',
        // Icon: ExitToApp,
        text: 'My profile',
        key: 'My-profileIdx',
        path: href(getProfileHomePageRoutePath(myProfile)),
      })
    }
    const isAdmin = authCtx.clientSessionData.isAdmin
    if (isAdmin) {
      avatarMenuItems.push({
        Icon: '',
        text: 'Settings',
        key: 'SettingsIdx',
        path: href('/settings'),
      })
    }

    return [...avatarMenuItems, ...regAvatarMenuItems]
  }, [authCtx, menuEntries])

  const avatarUrl = authCtx.clientSessionData?.userDisplay.avatarUrl
  const avatarMenuProps = useMemo<AvatarMenuProps>(() => {
    const avatarMenuProps: AvatarMenuProps = {
      avatarUrl,
      menuItems,
    }
    return avatarMenuProps
  }, [avatarUrl, menuItems])
  return avatarMenuProps
}
