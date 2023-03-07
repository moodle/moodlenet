import { AddonItem, Card, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import { FC } from 'react'
import {
  ProfileCardAccess,
  ProfileCardActions,
  ProfileCardData,
  ProfileCardState,
} from '../../../../../common/types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackground from '../../../assets/img/default-background.svg'
import { Link } from '../../elements/link.js'
import { OverallCard, OverallCardProps } from '../../molecules/OverallCard/OverallCard.js'
import './SmallProfileCard.scss'

export type SmallProfileCardProps = {
  mainColumnItems?: AddonItem[]
  overallCardProps: OverallCardProps

  data: ProfileCardData
  state: ProfileCardState
  actions: ProfileCardActions
  access: ProfileCardAccess
}

export const SmallProfileCard: FC<SmallProfileCardProps> = ({
  mainColumnItems,
  overallCardProps,

  data,
  state,
  actions,
  access,
}) => {
  const { userId, backgroundUrl, avatarUrl, displayName, profileHref } = data
  const { followed } = state
  const { toggleFollow } = actions
  const { isCreator, isAuthenticated } = access

  const header = (
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
  )

  const overallCard = <OverallCard noCard={true} showIcons={true} {...overallCardProps} />

  const buttons = (
    <div className="buttons">
      {!isCreator && followed && (
        <SecondaryButton onClick={toggleFollow} color="orange">
          Following
        </SecondaryButton>
      )}
      {!isCreator && !followed && (
        <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow} className="follow">
          Follow
        </PrimaryButton>
      )}
      {isCreator && <div className="empty" />}
    </div>
  )

  const updatedMainColumnItems = [header, overallCard, buttons, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  return (
    <Card className="small-profile-card" hover={true} key={userId}>
      <div className="images">
        <img className="background" src={backgroundUrl || defaultBackground} alt="Background" />
        <Link className="avatar" href={profileHref}>
          <img src={avatarUrl || defaultAvatar} alt="Avatar" />
        </Link>
      </div>
      <div className="info">
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </Card>
  )
}
