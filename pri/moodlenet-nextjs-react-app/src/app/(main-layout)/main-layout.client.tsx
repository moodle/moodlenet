'use client'
import { _nullish } from '@moodle/lib-types'
import { Bookmarks, DisplaySettings, ExitToApp, Settings } from '@mui/icons-material'
import Person from '@mui/icons-material/Person'
import { t } from 'i18next'
import { Trans } from 'next-i18next'
import Link from 'next/link'
import { appRoute, appRoutes } from '../../lib/common/appRoutes'
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

export type LoginHeaderProps = {
  loginRoute: appRoute
}
export function LoginHeaderButton({ loginRoute }: LoginHeaderProps) {
  return (
    <Link href={loginRoute} className="login-button access-button">
      <PrimaryButton>
        <Trans>
          <span>Login</span>
        </Trans>
        <Person />
      </PrimaryButton>
    </Link>
  )
}

export type SignupHeaderProps = {
  signupRoute: appRoute
}
export function SignupHeaderButton({ signupRoute }: SignupHeaderProps) {
  return (
    <Link href={signupRoute} className="signup-button access-button">
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
  profileRoute: appRoute
}
export function ProfileLink({ profileRoute, avatar }: ProfileLinkProps) {
  const [avatarUrl] = useAssetUrl(avatar, defaultAvatar)

  return (
    <Link href={profileRoute} className="avatar">
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

export type UserSettingsLinkProps = { settingsRoute: appRoute }
export function UserSettingsLink({ settingsRoute }: UserSettingsLinkProps) {
  return (
    <Link href={settingsRoute}>
      <Settings />
      Settings
    </Link>
  )
}

export type AdminSettingsLinkProps = { adminRoute: appRoute }
export function AdminSettingsLink({ adminRoute }: AdminSettingsLinkProps) {
  return (
    <Link href={adminRoute}>
      <DisplaySettings />
      Admin
    </Link>
  )
}

export type BookmarksLinkProps = { bookmarksRoute: appRoute }
export function BookmarksLink({ bookmarksRoute }: BookmarksLinkProps) {
  return (
    <Link href={bookmarksRoute}>
      <Bookmarks />
      Bookmarks
    </Link>
  )
}

export type FollowingLinkProps = { followingRoute: appRoute }
export function FollowingLink({ followingRoute }: FollowingLinkProps) {
  return (
    <Link href={followingRoute}>
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
