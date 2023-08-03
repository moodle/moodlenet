import type { AddonItem } from '@moodlenet/component-library'
import { Card } from '@moodlenet/component-library'
import type { OverallCardProps } from '@moodlenet/react-app/ui'
import { Link, OverallCard, withProxy } from '@moodlenet/react-app/ui'
import type { ProfileCardData } from '../../../../../common/profile/type.mjs'
import type { ProfileAccess, ProfileActions, ProfileState } from '../../../../../common/types.mjs'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import defaultBackground from '../../../assets/img/default-background.svg'
import { FollowButton } from '../../atoms/FollowButton/FollowButton.js'
import './ProfileCard.scss'

export type ProfileCardProps = {
  mainColumnItems: (AddonItem | null)[]
  bottomTouchColumnItems: (AddonItem | null)[]
  overallCardProps: Pick<OverallCardProps, 'items'>

  data: ProfileCardData
  state: ProfileState
  actions: ProfileActions
  access: ProfileAccess
}

export const ProfileCard = withProxy<ProfileCardProps>(
  ({
    mainColumnItems,
    bottomTouchColumnItems,
    overallCardProps,

    data,
    state,
    actions,
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
    const { isCreator, canFollow, isAuthenticated } = access

    const { toggleFollow } = actions
    const {
      followed,
      // isApproved
    } = state

    const header = (
      <div className="profile-card-header" key="header">
        <div className="title-header">
          <abbr className="title" title={displayName}>
            {displayName}
          </abbr>
        </div>
        {/* <abbr className="subtitle" title={organizationName}>
      {organizationName}
    </abbr> */}
      </div>
    )

    const overallCard = (
      <OverallCard noCard={true} showIcons={true} {...overallCardProps} key="overall-card" />
    )

    const followButton = (
      <FollowButton
        canFollow={canFollow}
        followed={followed}
        isAuthenticated={isAuthenticated}
        isCreator={isCreator}
        toggleFollow={toggleFollow}
        key="follow-button"
      />
    )

    const updatedMainColumnItems = [header, overallCard, ...(mainColumnItems ?? [])].filter(
      (item): item is AddonItem | JSX.Element => !!item,
    )

    const updatedBottomTouchColumnItems = [followButton, ...(bottomTouchColumnItems ?? [])].filter(
      (item): item is AddonItem | JSX.Element => !!item,
    )

    return (
      <Card
        className={`profile-card 
      ${/* isApproved ? 'approved' : '' */ ''}
      `}
        hover={true}
        key={userId}
      >
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
        <div className="bottom-touch">
          {updatedBottomTouchColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
      </Card>
    )
  },
  'ProfileCard',
)
