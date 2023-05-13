import { Bookmarks } from '@material-ui/icons'
import type { Href } from '@moodlenet/react-app/common'
import { Link, withProxy } from '@moodlenet/react-app/ui'
import { ExitToApp } from '@mui/icons-material'
import { ReactComponent as ArrowsIcon } from '../../../assets/icons/arrows.svg'
import defaultAvatar from '../../../assets/img/default-avatar.svg'

export type ProfileLinkAvatarMenuComponentProps = {
  profileHref: Href
  avatarUrl: string | undefined
}
export const ProfileLinkAvatarMenuComponent = withProxy<ProfileLinkAvatarMenuComponentProps>(
  ({ profileHref, avatarUrl = defaultAvatar }) => {
    return (
      <Link href={profileHref} className="avatar">
        <div
          style={{
            backgroundImage: 'url("' + avatarUrl + '")',
            backgroundSize: 'cover',
            borderRadius: '50%',
            height: '28px',
            width: '28px',
          }}
        />
        Profile
      </Link>
    )
  },
)

export type SignoutAvatarMenuComponentProps = { signout(): void }
export const SignoutAvatarMenuComponent = withProxy<SignoutAvatarMenuComponentProps>(
  ({ signout }) => {
    return (
      <span onClick={signout}>
        <ExitToApp /> Signout
      </span>
    )
  },
)

export type SettingsLinkAvatarMenuComponentProps = { settingsHref: Href }
export const SettingsLinkAvatarMenuComponent = withProxy<SettingsLinkAvatarMenuComponentProps>(
  ({ settingsHref }) => {
    return <Link href={settingsHref}>Settings</Link>
  },
)

export type BookmarksLinkAvatarMenuComponentProps = { bookmarksHref: Href }
export const BookmarksLinkAvatarMenuComponent = withProxy<BookmarksLinkAvatarMenuComponentProps>(
  ({ bookmarksHref }) => {
    return (
      <Link href={bookmarksHref}>
        <Bookmarks />
        Bookmarks
      </Link>
    )
  },
)

export type FollowingLinkAvatarMenuComponentProps = { followingHref: Href }
export const FollowingLinkAvatarMenuComponent = withProxy<FollowingLinkAvatarMenuComponentProps>(
  ({ followingHref }) => {
    return (
      <Link href={followingHref}>
        <ArrowsIcon />
        Following
      </Link>
    )
  },
)
