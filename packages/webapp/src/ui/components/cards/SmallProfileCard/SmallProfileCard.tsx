import { Trans } from '@lingui/macro'
import verifiedIcon from '../../../assets/icons/verified.svg'
import { withCtrl } from '../../../lib/ctrl'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import { OverallCard, OverallCardProps } from '../OverallCard/OverallCard'
import './styles.scss'

export type SmallProfileCardProps = {
  backgroundUrl: string
  avatarUrl: string
  displayName: string
  username: string
  organizationName: string
  isOwner?: boolean
  isVerified?: boolean
  isFollowing?: boolean
  isAuthenticated: boolean
  overallCardProps: OverallCardProps
  toggleFollow(): unknown
}

export const SmallProfileCard = withCtrl<SmallProfileCardProps>(
  ({
    avatarUrl,
    backgroundUrl,
    displayName,
    username,
    organizationName,
    isOwner,
    isVerified,
    isFollowing,
    isAuthenticated,
    overallCardProps,
    toggleFollow,
  }) => {
    return (
      <div className="small-profile-card">
        <img className="background" src={backgroundUrl} alt="Background" />
        <img className="avatar" src={avatarUrl} alt="Avatar" />
        <div className="info">
          <div className="profile-card-header">
            <div className="title">
              <abbr className="display-name" title={displayName}>{displayName}</abbr>
              {isVerified && <img className="verified-icon" src={verifiedIcon} alt="Verified" />}
            </div>
            <div className="subtitle">
              {username !== '' && <div>@{username}</div>}
              {organizationName !== '' && <div>{organizationName}</div>}
            </div>
          </div>
          <OverallCard noCard={true} showIcons={true} {...overallCardProps}/>
          {!isOwner && (
            <div className="buttons">
              {isFollowing ? (
                <SecondaryButton onClick={toggleFollow}>
                  <Trans>Unfollow</Trans>
                </SecondaryButton>
              ) : (
                <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow} className="follow">
                  <Trans>Follow</Trans>
                </PrimaryButton>
              )}
            </div>
          )}
        </div>
      </div>
    )
  },
)
