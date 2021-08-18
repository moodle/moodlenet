import { Trans } from '@lingui/macro'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import verifiedIcon from '../../../assets/icons/verified.svg'
import { withCtrl } from '../../../lib/ctrl'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import './styles.scss'

export type ProfileCardProps = {
  backgroundUrl: string
  username: string
  avatarUrl: string
  firstName: string
  lastName: string
  isOwner?: boolean
  isFollowing?: boolean
  email: string
  organizationName: string
  location: string
  siteUrl: string
  description: string
  isAuthenticated: boolean
  toggleFollow(): unknown
}

export const ProfileCard = withCtrl<ProfileCardProps>(
  ({
    avatarUrl,
    username,
    backgroundUrl,
    description,
    isOwner,
    isAuthenticated,
    email,
    isFollowing,
    firstName,
    lastName,
    location,
    toggleFollow,
    organizationName,
    siteUrl,
  }) => {
    return (
      <div className="profile-card">
        <img className="background" src={backgroundUrl} alt="Background" />
        <img className="avatar" src={avatarUrl} alt="Avatar" />
        <div className="info">
          <div className="profile-card-header">
            <div className="title">
              {firstName} {lastName}
              <img className="verified-icon" src={verifiedIcon} alt="Verified" />
            </div>
            <div className="subtitle">
              <span>@{username}</span>
              <span>·</span>
              <span>{organizationName}</span>
              <span>·</span>
              <span>{location}</span>
              <span>·</span>
              <a href={siteUrl}>{siteUrl}</a>
            </div>
          </div>
          <div className="presentation">{description}</div>
          {isOwner ? (
            <div className="buttons">
              <SecondaryButton>Edit Profile</SecondaryButton>
              <SecondaryButton>Go to Setting</SecondaryButton>
            </div>
          ) : (
            <div className="buttons">
              {isFollowing ? (
                <SecondaryButton onClick={toggleFollow}>
                  <Trans>Unfollow</Trans>
                </SecondaryButton>
              ) : (
                <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow}>
                  <Trans>Follow</Trans>
                </PrimaryButton>
              )}
                <a href={`mailto:${email}`} target="-_blank" className={`${isAuthenticated ? '' : 'font-disabled'}`}>
                  <MailOutlineIcon />
                </a>
            </div>
          )}
        </div>
      </div>
    )
  },
)
