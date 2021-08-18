import verifiedIcon from '../../../assets/icons/verified.svg'
import { withCtrl } from '../../../lib/ctrl'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import './styles.scss'

export type ProfileCardProps = {
  backgroundUrl: string
  username: string
  avatarUrl: string
  firstName: string
  lastName: string
  organizationName: string
  location: string
  siteUrl: string
  description: string
}

export const ProfileCard = withCtrl<ProfileCardProps>(
  ({ avatarUrl, username, backgroundUrl, description, firstName, lastName, location, organizationName, siteUrl }) => {
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
          <div className="buttons">
            <SecondaryButton>Edit Profile</SecondaryButton>
            <SecondaryButton>Go to Setting</SecondaryButton>
          </div>
        </div>
      </div>
    )
  },
)
