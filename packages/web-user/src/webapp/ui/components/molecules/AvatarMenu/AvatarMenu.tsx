import { FloatingMenu, FloatingMenuContentItem } from '@moodlenet/component-library'
import { ComponentType, FC, useMemo } from 'react'
import defaultAvatar from '../../../assets/img/default-avatar.svg'

export type AvatarMenuItem = {
  Component: ComponentType
  key: string
  className?: string
}
export type AvatarMenuProps = {
  menuItems: AvatarMenuItem[]
  avatarUrl: string | undefined
  // settingsHref: Href | null
  // signout(): void
  // profileHref: Href
}

export const AvatarMenu: FC<AvatarMenuProps> = ({
  menuItems,
  avatarUrl = defaultAvatar,
  // profileHref,
  // settingsHref,
  // signout,
}) => {
  const avatar = useMemo(
    () => ({
      backgroundImage: `url(${avatarUrl})`,
      // backgroundImage: 'url(' + defaultAvatar + ')',
      // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
      backgroundSize: 'cover',
    }),
    [avatarUrl],
  )
  // const allMenuItems = useMemo(() => {
  //   const settingsLinkAvatarMenuItem: AvatarMenuItem | null = settingsHref && {
  //     Component: () => <SettingsLinkComponent settingsHref={settingsHref} />,
  //     key: 'settings',
  //   }
  //   const profileLinkAvatarMenuItem: AvatarMenuItem = {
  //     Component: () => (
  //       <ProfileLinkAvatarMenuComponent avatarUrl={avatarUrl} profileHref={profileHref} />
  //     ),
  //     key: 'profile',
  //   }
  //   const signoutAvatarMenuItem: AvatarMenuItem = {
  //     Component: () => <SignoutAvatarMenuComponent signout={signout} />,
  //     key: 'signout',
  //   }
  //   return [
  //     profileLinkAvatarMenuItem,
  //     ...menuItems,
  //     ...(settingsLinkAvatarMenuItem ? [settingsLinkAvatarMenuItem] : []),
  //     signoutAvatarMenuItem,
  //   ]
  // }, [avatarUrl, menuItems, profileHref, settingsHref, signout])
  const menuContent = useMemo(() => {
    return menuItems.map(({ Component, key, className = '' }) => {
      const floatingMenuContentItem: FloatingMenuContentItem = {
        Component,
        key,
        className: `avatar-menu-item ${className}`,
      }
      return floatingMenuContentItem
    })
  }, [menuItems])

  return menuItems.length ? (
    <FloatingMenu
      className="avatar-menu"
      key="avatar-menu"
      abbr="User menu"
      menuContent={menuContent}
      hoverElement={<div style={avatar} className="avatar" />}
    />
  ) : null
}
