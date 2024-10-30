'use client'
import { _nullish } from '@moodle/lib-types'
import { Bookmarks, DisplaySettings, ExitToApp, Settings } from '@mui/icons-material'
import Person from '@mui/icons-material/Person'
import { t } from 'i18next'
import { Trans } from 'next-i18next'
import Link from 'next/link'
import { sitepaths } from '../../lib/common/sitepaths'
import { FloatingMenu, FloatingMenuContentItem } from '../../ui/atoms/FloatingMenu/FloatingMenu'
import { PrimaryButton } from '../../ui/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../ui/atoms/Searchbox/Searchbox'
import { TertiaryButton } from '../../ui/atoms/TertiaryButton/TertiaryButton'
import { ReactComponent as ArrowsIcon } from '../../ui/lib/assets/icons/arrows.svg'
// import ArrowsIcon from '../../ui/lib/assets/icons/arrows.svg'
import { clientSlotItem } from '../../lib/common/types'
import { asset } from '@moodle/module/storage'
import { useAssetUrl } from '../../lib/client/globalContexts'
import defaultAvatar from '../../ui/lib/assets/img/default-avatar.svg'
export function LoginHeaderButton() {
  return (
    <Link href={sitepaths.login()} className="login-button access-button">
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
  return (
    <Link href={sitepaths.signup()} className="signup-button access-button">
      <TertiaryButton /* style={{ backgroundColor: 'transparent', border: 'none' }} */>
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
        search: () => alert('search'),
        boxSize: 'small',
        triggerBtn: true,
      }}
    />
  )
}

export type ProfileLinkProps = {
  avatar: asset | _nullish
  profileHref: string
}
export function ProfileLink({ profileHref, avatar }: ProfileLinkProps) {
  const [avatarUrl] = useAssetUrl(avatar, defaultAvatar)

  return (
    <Link href={profileHref} className="avatar">
      <div
        style={{
          backgroundImage: `url(${avatarUrl})`,
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

export type UserSettingsLinkProps = { settingsHref: string }
export function UserSettingsLink({ settingsHref }: UserSettingsLinkProps) {
  return (
    <Link href={settingsHref}>
      <Settings />
      Settings
    </Link>
  )
}

export type AdminSettingsLinkProps = { adminHref: string }
export function AdminSettingsLink({ adminHref }: AdminSettingsLinkProps) {
  return (
    <Link href={adminHref}>
      <DisplaySettings />
      Admin
    </Link>
  )
}

export type BookmarksLinkProps = { bookmarksHref: string }
export function BookmarksLink({ bookmarksHref }: BookmarksLinkProps) {
  return (
    <Link href={bookmarksHref}>
      <Bookmarks />
      Bookmarks
    </Link>
  )
}

export type FollowingLinkProps = { followingHref: string }
export function FollowingLink({ followingHref }: FollowingLinkProps) {
  return (
    <Link href={followingHref}>
      <ArrowsIcon />
      Following
    </Link>
  )
}

export type AvatarMenuProps = {
  avatar: asset | _nullish
  menuItems: clientSlotItem[]
}

export function AvatarMenu({ menuItems, avatar }: AvatarMenuProps) {
  const [avatarUrl] = useAssetUrl(avatar, defaultAvatar)

  const avatarStyle = {
    backgroundImage: `url(${avatarUrl})`,
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
