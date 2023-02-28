import { Card, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import { FC } from 'react'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackground from '../../../assets/img/default-background.svg'
import { Href, Link } from '../../elements/link.js'
import { OverallCard, OverallCardProps } from '../../molecules/OverallCard/OverallCard.js'
import './SmallProfileCard.scss'

export type SmallProfileCardProps = {
  id: string
  backgroundUrl: string | null
  avatarUrl: string | null
  displayName: string
  username: string
  organizationName: string
  profileHref: Href
  isOwner?: boolean
  followed?: boolean
  isAuthenticated: boolean
  overallCardProps: OverallCardProps
  toggleFollow(): unknown
}

export const SmallProfileCard: FC<SmallProfileCardProps> = ({
  avatarUrl,
  backgroundUrl,
  displayName,
  // organizationName,
  profileHref,
  isOwner,
  followed,
  isAuthenticated,
  overallCardProps,
  toggleFollow,
}) => {
  return (
    <Card className="small-profile-card" hover={true}>
      <div className="images">
        <img className="background" src={backgroundUrl || defaultBackground} alt="Background" />
        <Link className="avatar" href={profileHref}>
          <img src={avatarUrl || defaultAvatar} alt="Avatar" />
        </Link>
      </div>
      <div className="info">
        <Link className="profile-card-header" href={profileHref}>
          <div className="title-header">
            <abbr className="title" title={displayName}>
              {displayName}
            </abbr>
          </div>
          {/* <abbr className="subtitle" title={organizationName}>
              {organizationName}
            </abbr> */}
        </Link>
        <OverallCard noCard={true} showIcons={true} {...overallCardProps} />

        <div className="buttons">
          {!isOwner && followed && (
            <SecondaryButton onClick={toggleFollow} color="orange">
              Following
            </SecondaryButton>
          )}
          {!isOwner && !followed && (
            <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow} className="follow">
              Follow
            </PrimaryButton>
          )}
          {isOwner && <div className="empty" />}
        </div>
      </div>
    </Card>
  )
}
