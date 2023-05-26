import type { FloatingMenuContentItem } from '@moodlenet/component-library'
import { FloatingMenu } from '@moodlenet/component-library'
import type { ComponentType, FC } from 'react'
import { useMemo } from 'react'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import type {
  AdminSettingsLinkAvatarMenuComponentProps,
  BookmarksLinkAvatarMenuComponentProps,
  FollowingLinkAvatarMenuComponentProps,
  ProfileLinkAvatarMenuComponentProps,
  SignoutAvatarMenuComponentProps,
  UserSettingsLinkAvatarMenuComponentProps,
} from './webUserAvatarMenuComponents.js'
import {
  AdminSettingsLinkAvatarMenuComponent,
  BookmarksLinkAvatarMenuComponent,
  FollowingLinkAvatarMenuComponent,
  ProfileLinkAvatarMenuComponent,
  SignoutAvatarMenuComponent,
  UserSettingsLinkAvatarMenuComponent,
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
  bookmarksMenuProps: null | Pick<BookmarksLinkAvatarMenuComponentProps, 'bookmarksHref'>
  followingMenuProps: null | Pick<FollowingLinkAvatarMenuComponentProps, 'followingHref'>
  adminSettingsMenuProps: null | AdminSettingsLinkAvatarMenuComponentProps
  userSettingsMenuProps: null | UserSettingsLinkAvatarMenuComponentProps
  signoutMenuProps: SignoutAvatarMenuComponentProps
}

export const AvatarMenu: FC<AvatarMenuProps> = ({
  menuItems,
  avatarUrl = defaultAvatar,
  adminSettingsMenuProps,
  userSettingsMenuProps,
  profileMenuProps,
  bookmarksMenuProps,
  followingMenuProps,
  signoutMenuProps,
}) => {
  const allMenuItems = useMemo(() => {
    const profileLinkAvatarMenuItem: AvatarMenuItem | null = profileMenuProps && {
      Component: () => (
        <ProfileLinkAvatarMenuComponent {...profileMenuProps} avatarUrl={avatarUrl} />
      ),
      key: 'profile',
    }

    const bookmarksAvatarMenuItem: AvatarMenuItem | null = bookmarksMenuProps && {
      Component: () => <BookmarksLinkAvatarMenuComponent {...bookmarksMenuProps} />,
      key: 'bookmarks',
    }

    const followingAvatarMenuItem: AvatarMenuItem | null = followingMenuProps && {
      Component: () => <FollowingLinkAvatarMenuComponent {...followingMenuProps} />,
      key: 'following',
    }

    const userSettingsLinkAvatarMenuItem: AvatarMenuItem | null = userSettingsMenuProps && {
      Component: () => <UserSettingsLinkAvatarMenuComponent {...userSettingsMenuProps} />,
      key: 'admin-settings',
    }

    const adminSettingsLinkAvatarMenuItem: AvatarMenuItem | null = adminSettingsMenuProps && {
      Component: () => <AdminSettingsLinkAvatarMenuComponent {...adminSettingsMenuProps} />,
      key: 'admin-settings',
    }

    const signoutAvatarMenuItem: AvatarMenuItem = {
      Component: () => <SignoutAvatarMenuComponent {...signoutMenuProps} />,
      key: 'signout',
    }

    return [
      ...(profileLinkAvatarMenuItem ? [profileLinkAvatarMenuItem] : []),
      ...(bookmarksAvatarMenuItem ? [bookmarksAvatarMenuItem] : []),
      ...(followingAvatarMenuItem ? [followingAvatarMenuItem] : []),
      ...menuItems,
      ...(adminSettingsLinkAvatarMenuItem ? [adminSettingsLinkAvatarMenuItem] : []),
      ...(userSettingsLinkAvatarMenuItem ? [userSettingsLinkAvatarMenuItem] : []),
      signoutAvatarMenuItem,
    ]
  }, [
    avatarUrl,
    bookmarksMenuProps,
    followingMenuProps,
    menuItems,
    profileMenuProps,
    adminSettingsMenuProps,
    userSettingsMenuProps,
    signoutMenuProps,
  ])

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

  return floatingMenuContentItems.length ? (
    <FloatingMenu
      className="avatar-menu"
      key="avatar-menu"
      abbr="User menu"
      menuContent={floatingMenuContentItems}
      hoverElement={<div style={avatarStyle} className="avatar" />}
    />
  ) : null
}
