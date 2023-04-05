import { AddonItem, Card } from '@moodlenet/component-library'
import { FC } from 'react'
import {
  ProfileAccess,
  ProfileActions,
  ProfileData,
  ProfileState,
} from '../../../../../common/types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackground from '../../../assets/img/default-background.svg'
import { Link } from '../../elements/link.js'
import { OverallCard, OverallCardProps } from '../../molecules/OverallCard/OverallCard.js'
import './ProfileCard.scss'

export type ProfileCardProps = {
  mainColumnItems?: AddonItem[]
  bottomTouchColumnItems?: AddonItem[]
  overallCardProps: OverallCardProps

  data: ProfileData
  state: ProfileState
  actions: ProfileActions
  access: ProfileAccess
}

export const ProfileCard: FC<ProfileCardProps> = ({
  mainColumnItems,
  overallCardProps,

  data,
  // state,
  // actions,
  access,
}) => {
  const {
    userId,
    backgroundUrl,
    avatarUrl,
    displayName,
    profileHref,
    // organizationName,
  } = data
  // const { followed } = state
  // const { toggleFollow } = actions
  const {
    isCreator,
    // isAuthenticated
  } = access

  const header = (
    <Link className="profile-card-header" href={profileHref} key="header">
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

  const overallCard = (
    <OverallCard noCard={true} showIcons={true} {...overallCardProps} key="overall-card" />
  )

  const buttons = (
    <div className="buttons" key="buttons">
      {/* {!isCreator && followed && (
        <SecondaryButton onClick={toggleFollow} color="orange">
          Following
        </SecondaryButton>
      )}
      {!isCreator && !followed && (
        <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow} className="follow">
          Follow
        </PrimaryButton>
      )} */}
      {isCreator && <div className="empty" />}
    </div>
  )

  const updatedMainColumnItems = [header, overallCard, buttons, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  return (
    <Card className="profile-card" hover={true} key={userId}>
      <Link className="profile-card-content" href={profileHref}>
        <div className="images">
          <img className="background" src={backgroundUrl || defaultBackground} alt="Background" />
          <div className="avatar">
            <img src={avatarUrl || defaultAvatar} alt="Avatar" />
          </div>
        </div>

        <div className="info">
          {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
      </Link>
    </Card>
  )
}
