import { Href } from '@moodlenet/react-app/common'
import { Link, proxied } from '@moodlenet/react-app/ui'
import { ExitToApp } from '@mui/icons-material'
import defaultAvatar from '../../../assets/img/default-avatar.svg'

export type SettingsLinkAvatarMenuComponentProps = { settingsHref: Href }
export const SettingsLinkAvatarMenuComponent = proxied<SettingsLinkAvatarMenuComponentProps>(
  ({ settingsHref }) => {
    return <Link href={settingsHref}>Settings</Link>
  },
)

export type ProfileLinkAvatarMenuComponentProps = {
  profileHref: Href
  avatarUrl: string | undefined
}
export const ProfileLinkAvatarMenuComponent = proxied<ProfileLinkAvatarMenuComponentProps>(
  ({ profileHref, avatarUrl = defaultAvatar }) => {
    return (
      <Link
        href={profileHref}
        style={{
          backgroundImage: 'url("' + avatarUrl + '")',
          backgroundSize: 'cover',
          borderRadius: '50%',
          height: '28px',
          width: '28px',
        }}
        className="avatar"
      >
        Profile
      </Link>
    )
  },
)

export type SignoutAvatarMenuComponentProps = { signout(): void }
export const SignoutAvatarMenuComponent = proxied<SignoutAvatarMenuComponentProps>(
  ({ signout }) => {
    return (
      <span onClick={signout}>
        <ExitToApp /> Signout
      </span>
    )
  },
)
