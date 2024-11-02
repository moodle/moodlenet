import FilterNone from '@mui/icons-material/FilterNone'
import Grade from '@mui/icons-material/Grade'
import PermIdentity from '@mui/icons-material/PermIdentity'
import { moodlenetContributorInfo } from '@moodle/module/moodlenet-react-app'
import Link from 'next/link'
import { useAssetUrl, useMyLinkedContent, usePointSystem } from '../../../lib/client/globalContexts'
import { getUserLevelDetails } from '../../../lib/client/user-levels/lib'
import { appRoutes } from '../../../lib/common/appRoutes'
import defaultAvatar from '../../../ui/lib/assets/img/default-avatar.svg'
import defaultBackground from '../../../ui/lib/assets/img/default-background.svg'
import { Card } from '../../atoms/Card/Card'
import { FollowButton } from '../../atoms/FollowButton/FollowButton'
import { OverallCard } from '../OverallCard/OverallCard'
import './ProfileCard.scss'

export function ProfileCard({ moodlenetContributorAccessObject, stats }: moodlenetContributorInfo) {
  const { pointSystem } = usePointSystem()
  const { pointAvatar, level, title } = getUserLevelDetails(pointSystem, moodlenetContributorAccessObject.stats.points)
  const { avatar, background, displayName } = moodlenetContributorAccessObject.profileInfo

  const permissions = moodlenetContributorAccessObject.permissions

  const [following] = useMyLinkedContent('follow', 'moodlenetContributors', moodlenetContributorAccessObject.id)
  const profileHomeHref = appRoutes(
    `/profile/${moodlenetContributorAccessObject.id}/${moodlenetContributorAccessObject.slug}`,
  )
  const [backgroundUrl] = useAssetUrl(background)
  const [avatarUrl] = useAssetUrl(avatar)

  return (
    <Card
      className={`profile-card
      ${/* isContributor ? 'approved' : '' */ ''}
      `}
      hover={true}
    >
      <Link className="profile-card-content" href={profileHomeHref}>
        <div className="images">
          <img className="background" src={backgroundUrl || defaultBackground} alt="Background" />
          <div className="avatar">
            <abbr className={`level-avatar level-${level}`} title={`Level ${level} - ${title}`}>
              <img className="avatar" src={pointAvatar} alt="level avatar" />
            </abbr>
            <img src={avatarUrl || defaultAvatar} alt="Avatar" />
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
          disabled={!permissions.follow}
          following={following}
          toggleFollow={() =>
            // FIXME
            alert('toggleFollow')
          }
        />
      </div>
    </Card>
  )
}
