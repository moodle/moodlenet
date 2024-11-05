import { selection } from '@moodle/lib-types'
import { webappContributorAccessData } from '@moodle/module/moodlenet-react-app'
import FilterNone from '@mui/icons-material/FilterNone'
import Grade from '@mui/icons-material/Grade'
import PermIdentity from '@mui/icons-material/PermIdentity'
import Link from 'next/link'
import { useAssetUrl, usePointSystem } from '../../../lib/client/globalContexts'
import { getUserLevelDetails } from '../../../lib/client/user-levels/lib'
import { appRoute } from '../../../lib/common/appRoutes'
import defaultAvatarSrc from '../../../ui/lib/assets/img/default-avatar.svg'
import defaultBackgroundSrc from '../../../ui/lib/assets/img/default-background.svg'
import { Card } from '../../atoms/Card/Card'
import { FollowButton } from '../../atoms/FollowButton/FollowButton'
import { OverallCard } from '../OverallCard/OverallCard'
import './ProfileCard.scss'

type profileCardActions = {
  toggleFollow(): Promise<void>
}
export type profileCardProps = Pick<webappContributorAccessData, 'myLinks' | 'profileInfo' | 'stats'> & {
  actions: selection<profileCardActions, never, 'toggleFollow'>
  profileHomeRoute: appRoute
}

export function ProfileCard({ myLinks, actions, profileInfo, stats, profileHomeRoute }: profileCardProps) {
  const { pointSystem } = usePointSystem()
  const { pointAvatar, level, title } = getUserLevelDetails(pointSystem, stats.points)
  const { avatar, background, displayName } = profileInfo

  const [backgroundUrl] = useAssetUrl(background, defaultBackgroundSrc)
  const [avatarUrl] = useAssetUrl(avatar, defaultAvatarSrc)

  return (
    <Card
      className={`profile-card
      ${/* isContributor ? 'approved' : '' */ ''}
      `}
      hover={true}
    >
      <Link className="profile-card-content" href={profileHomeRoute}>
        <div className="images">
          <img className="background" src={backgroundUrl} alt="Background" />
          <div className="avatar">
            <abbr className={`level-avatar level-${level}`} title={`Level ${level} - ${title}`}>
              <img className="avatar" src={pointAvatar} alt="level avatar" />
            </abbr>
            <img src={avatarUrl} alt="Avatar" />
          </div>
        </div>
        <div className="info">
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
          <OverallCard
            items={[
              {
                Icon: PermIdentity,
                name: 'Followers',
                className: 'followers',
                value: stats.followersCount,
                // href: followers,
              },
              {
                Icon: Grade,
                name: 'Following',
                className: 'following',
                value: stats.followingCount,
                // href: following
              },
              {
                Icon: FilterNone,
                name: 'Resources',
                className: 'resources',
                value: stats.publishedResourcesCount,
              },
            ]}
          />
        </div>
      </Link>
      <div className="bottom-touch">
        <FollowButton
          disabled={!actions.toggleFollow}
          following={myLinks.followed}
          toggleFollow={() => actions.toggleFollow?.()}
        />
      </div>
    </Card>
  )
}
