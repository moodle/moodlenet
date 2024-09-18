'use client'
import { _falsy } from '@moodle/lib-types'
import { FloatingMenu, FloatingMenuContentItem } from '../../ui/atoms/FloatingMenu/FloatingMenu'
import Person from '@mui/icons-material/Person'
import { t } from 'i18next'
import Link from 'next/link'
import { sitepaths } from '../../lib/common/utils/sitepaths'
import { PrimaryButton } from '../../ui/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../ui/atoms/Searchbox/Searchbox'
import { TertiaryButton } from '../../ui/atoms/TertiaryButton/TertiaryButton'
import { Trans } from 'react-i18next'
import { Bookmarks, DisplaySettings, ExitToApp, Settings } from '@mui/icons-material'
import ArrowsIcon from '../../assets/icons/arrows.svg'
  // FIXME: defaultAvatar is a react component that renders the source svg can't be set as bgimage
  import defaultAvatar from '../../assets/img/default-avatar.svg'
  // FIXME: defaultAvatar is a react component that renders the source svg can't be set as bgimage
import { Href } from '../../lib/common/types'
import { clientSlotItem } from '../../lib/common/pages'

export function LoginHeaderButton() {
  const {
    pages: { access },
  } = sitepaths()
  return (
    <Link href={access.login} className="login-button access-button">
      <PrimaryButton>
        <Trans>
          <span>Login</span>
        </Trans>
        <Person />
      </PrimaryButton>
    </Link>
  )
}

export function SignupHeaderButton() {
  const {
    pages: { access },
  } = sitepaths()
  return (
    <Link href={access.signup} className="signup-button access-button">
      <TertiaryButton>
        <Trans>Sign up</Trans>
      </TertiaryButton>
    </Link>
  )
}

export function HeaderSearchbox() {
  return (
    <Searchbox
      {...{
        placeholder: t('Search for open educational content'),
        search: console.error,
        boxSize: 'small',
        triggerBtn: true,
      }}
    />
  )
}

export type ProfileLinkProps = {
  profileHref: Href
  avatarUrl: string | _falsy
}
export function ProfileLink({ profileHref, avatarUrl }: ProfileLinkProps) {
  return (
    <Link href={profileHref} className="avatar">
      <div
        style={{
          backgroundImage: 'url("' + avatarUrl ?? defaultAvatar + '")',
          backgroundSize: 'cover',
          borderRadius: '50%',
          height: '28px',
          width: '28px',
        }}
      />
      Profile
    </Link>
  )
}

export type LogoutProps = { logout(): void }
export function Logout({ logout }: LogoutProps) {
  return (
    <span onClick={() => logout()}>
      <ExitToApp /> Logout
    </span>
  )
}

export type UserSettingsLinkProps = { settingsHref: Href }
export function UserSettingsLink({ settingsHref }: UserSettingsLinkProps) {
  return (
    <Link href={settingsHref}>
      <Settings />
      Settings
    </Link>
  )
}

export type AdminSettingsLinkProps = { adminHref: Href }
export function AdminSettingsLink({ adminHref }: AdminSettingsLinkProps) {
  return (
    <Link href={adminHref}>
      <DisplaySettings />
      Admin
    </Link>
  )
}

export type BookmarksLinkProps = { bookmarksHref: Href }
export function BookmarksLink({ bookmarksHref }: BookmarksLinkProps) {
  return (
    <Link href={bookmarksHref}>
      <Bookmarks />
      Bookmarks
    </Link>
  )
}

export type FollowingLinkProps = { followingHref: Href }
export function FollowingLink({ followingHref }: FollowingLinkProps) {
  return (
    <Link href={followingHref}>
      <ArrowsIcon />
      Following
    </Link>
  )
}

export type AvatarMenuProps = {
  avatarUrl: string | _falsy
  menuItems: clientSlotItem[]
}

export function AvatarMenu({ menuItems, avatarUrl }: AvatarMenuProps) {
  const avatarStyle = {
    backgroundImage: `url(${avatarUrl ?? defaultAvatar})`,
    backgroundSize: 'cover',
  }
  const menuItemsElement = menuItems.map<FloatingMenuContentItem>(Element => ({
    Element,
    wrapperClassName: `avatar-menu-item`,
  }))
  return (
    <FloatingMenu
      className="avatar-menu"
      key="avatar-menu"
      abbr="User menu"
      menuContent={menuItemsElement}
      hoverElement={<div style={avatarStyle} className="avatar" />}
    />
  )
}
