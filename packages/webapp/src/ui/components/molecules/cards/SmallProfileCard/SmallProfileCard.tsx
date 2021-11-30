import { Trans } from '@lingui/macro'
import { Href, Link } from '../../../../elements/link'
import { withCtrl } from '../../../../lib/ctrl'
import defaultAvatar from '../../../../static/img/default-avatar.svg'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import Card from '../../../atoms/Card/Card'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import { OverallCard, OverallCardProps } from '../OverallCard/OverallCard'
import './styles.scss'

export type SmallProfileCardProps = {
  backgroundUrl: string | null
  avatarUrl: string | null
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
        <img
          className="background"
          src={backgroundUrl || defaultBackgroud}
          alt="Background"
        />
        <Link className="avatar" href={profileHref}>
          <img src={avatarUrl || defaultAvatar} alt="Avatar" />
        </Link>
        <div className="info">
          <Link className="profile-card-header" href={profileHref}>
            <abbr className="title" title={displayName}>
              {displayName}
            </abbr>
            <abbr className="subtitle" title={organizationName}>
              {organizationName}
            </abbr>
          </Link>
          <OverallCard noCard={true} showIcons={true} {...overallCardProps} />
          {!isOwner && (
            <div className="buttons">
              {isFollowing ? (
                <SecondaryButton onClick={toggleFollow}>
                  <Trans>Unfollow</Trans>
                </SecondaryButton>
              ) : (
                <PrimaryButton
                  disabled={!isAuthenticated}
                  onClick={toggleFollow}
                  className="follow"
                >
                  <Trans>Follow</Trans>
                </PrimaryButton>
              )}
            </div>
          )}
        </div>
      </Card>
    )
  }
)
