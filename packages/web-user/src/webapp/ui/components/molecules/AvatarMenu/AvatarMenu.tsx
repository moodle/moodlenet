import { FloatingMenu, FloatingMenuContentItem } from '@moodlenet/component-library'
import { ComponentType, FC, useMemo } from 'react'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import {
  ProfileLinkAvatarMenuComponent,
  ProfileLinkAvatarMenuComponentProps,
  SettingsLinkAvatarMenuComponent,
  SettingsLinkAvatarMenuComponentProps,
  SignoutAvatarMenuComponent,
  SignoutAvatarMenuComponentProps,
} from './webUserAvatarMenuComponents.js'

export type AvatarMenuItem = {
  Component: ComponentType
  key: string
  className?: string
}
export type AvatarMenuProps = {
  menuItems: AvatarMenuItem[]
  avatarUrl: string | undefined
  profileMenuProps: null | Pick<ProfileLinkAvatarMenuComponentProps, 'profileHref'>
  settingsMenuProps: null | SettingsLinkAvatarMenuComponentProps
  signoutMenuProps: SignoutAvatarMenuComponentProps
}

export const AvatarMenu: FC<AvatarMenuProps> = ({
  menuItems,
  avatarUrl = defaultAvatar,
  settingsMenuProps,
  profileMenuProps,
  signoutMenuProps,
}) => {
  const allMenuItems = useMemo(() => {
    const settingsLinkAvatarMenuItem: AvatarMenuItem | null = settingsMenuProps && {
      Component: () => <SettingsLinkAvatarMenuComponent {...settingsMenuProps} />,
      key: 'settings',
    }

    const profileLinkAvatarMenuItem: AvatarMenuItem | null = profileMenuProps && {
      Component: () => (
        <ProfileLinkAvatarMenuComponent {...profileMenuProps} avatarUrl={avatarUrl} />
      ),
      key: 'profile',
    }

    const signoutAvatarMenuItem: AvatarMenuItem = {
      Component: () => <SignoutAvatarMenuComponent {...signoutMenuProps} />,
      key: 'signout',
    }

    return [
      ...(profileLinkAvatarMenuItem ? [profileLinkAvatarMenuItem] : []),
      ...menuItems,
      ...(settingsLinkAvatarMenuItem ? [settingsLinkAvatarMenuItem] : []),
      signoutAvatarMenuItem,
    ]
  }, [avatarUrl, menuItems, profileMenuProps, settingsMenuProps, signoutMenuProps])

  const floatingMenuContentItems = useMemo(() => {
    return allMenuItems.map(({ Component, key, className = '' }) => {
      const floatingMenuContentItem: FloatingMenuContentItem = {
        Component,
        key,
        className: `avatar-menu-item ${className}`,
      }
      return floatingMenuContentItem
    })
  }, [allMenuItems])

  const avatarStyle = {
    backgroundImage: `url(${avatarUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  return menuItems.length ? (
    <FloatingMenu
      className="avatar-menu"
      key="avatar-menu"
      abbr="User menu"
      menuContent={floatingMenuContentItems}
      hoverElement={<div style={avatarStyle} className="avatar" />}
    />
  ) : null
}
