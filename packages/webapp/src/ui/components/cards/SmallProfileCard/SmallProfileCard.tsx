import { Trans } from '@lingui/macro'
import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import Card from '../../atoms/Card/Card'
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
  profileHref: Href
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
    organizationName,
    profileHref,
    isOwner,
    isFollowing,
    isAuthenticated,
    overallCardProps,
    toggleFollow,
  }) => {
    return (
      <Card className="small-profile-card" hover={true}>
        <img className="background" src={backgroundUrl} alt="Background" />
        <Link className="avatar" href={profileHref}>
          <img src={avatarUrl} alt="Avatar" />
        </Link>
        <div className="info">
          <Link className="profile-card-header" href={profileHref}>
            <abbr className="title" title={displayName}>
              {displayName}
            </abbr>
            <div className="subtitle">
              <div>{organizationName}</div>
            </div>
          </Link>
          <OverallCard noCard={true} showIcons={true} {...overallCardProps} />
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
      </Card>
    )
  },
)
