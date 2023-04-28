import { href } from '@moodlenet/react-app/common'
import { useContext, useMemo } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import { AvatarMenuItem, AvatarMenuProps } from './AvatarMenu.js'
import {
  ProfileLinkAvatarMenuComponent,
  SettingsLinkAvatarMenuComponent,
  SignoutAvatarMenuComponent,
} from './webUserAvatarMenuComponents.js'

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

    const avatarMenuItems: AvatarMenuItem[] = []

    const myProfile = authCtx.clientSessionData.myProfile
    if (myProfile) {
      avatarMenuItems.push({
        Component: () => (
          <ProfileLinkAvatarMenuComponent
            avatarUrl={authCtx.clientSessionData.userDisplay.avatarUrl}
            profileHref={href('/settings')}
          />
        ),
        key: 'profile',
      })
    }
    const isAdmin = authCtx.clientSessionData.isAdmin
    if (isAdmin) {
      avatarMenuItems.push({
        Component: () => <SettingsLinkAvatarMenuComponent settingsHref={href('/settings')} />,
        key: 'settings',
      })
    }
    avatarMenuItems.push({
      Component: () => <SignoutAvatarMenuComponent signout={authCtx.logout} />,
      key: 'signout',
    })

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
