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
    const profileLinkAvatarMenuItem: FloatingMenuContentItem | null = profileMenuProps && {
      Element: (
        <ProfileLinkAvatarMenuComponent key="profile" {...profileMenuProps} avatarUrl={avatarUrl} />
      ),
    }

    const bookmarksAvatarMenuItem: FloatingMenuContentItem | null = bookmarksMenuProps && {
      Element: <BookmarksLinkAvatarMenuComponent key="bookmarks" {...bookmarksMenuProps} />,
    }

    const followingAvatarMenuItem: FloatingMenuContentItem | null = followingMenuProps && {
      Element: <FollowingLinkAvatarMenuComponent key="following" {...followingMenuProps} />,
    }

    const userSettingsLinkAvatarMenuItem: FloatingMenuContentItem | null =
      userSettingsMenuProps && {
        Element: (
          <UserSettingsLinkAvatarMenuComponent key="admin-settings" {...userSettingsMenuProps} />
        ),
      }

    const adminSettingsLinkAvatarMenuItem: FloatingMenuContentItem | null =
      adminSettingsMenuProps && {
        Element: (
          <AdminSettingsLinkAvatarMenuComponent key="admin-settings" {...adminSettingsMenuProps} />
        ),
      }

    const signoutAvatarMenuItem: FloatingMenuContentItem | null = {
      Element: <SignoutAvatarMenuComponent key="signout" {...signoutMenuProps} />,
    }

    const menuItemsElement = menuItems.map<FloatingMenuContentItem>(
      ({ Component, key, className }) => ({
        Element: <Component key={key} />,
        wrapperClassName: `avatar-menu-item ${className}`,
      }),
    )

    return [
      ...(profileLinkAvatarMenuItem ? [profileLinkAvatarMenuItem] : []),
      ...(bookmarksAvatarMenuItem ? [bookmarksAvatarMenuItem] : []),
      ...(followingAvatarMenuItem ? [followingAvatarMenuItem] : []),
      ...(adminSettingsLinkAvatarMenuItem ? [adminSettingsLinkAvatarMenuItem] : []),
      ...(userSettingsLinkAvatarMenuItem ? [userSettingsLinkAvatarMenuItem] : []),
      ...menuItemsElement,
      signoutAvatarMenuItem,
    ].map<FloatingMenuContentItem>(({ Element, wrapperClassName = '' }) => ({
      Element,
      wrapperClassName: `avatar-menu-item ${wrapperClassName}`,
    }))
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
    return allMenuItems
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
