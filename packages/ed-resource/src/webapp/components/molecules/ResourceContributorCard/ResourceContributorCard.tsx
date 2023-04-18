import { Card } from '@moodlenet/component-library'
import { Href, Link } from '@moodlenet/react-app/ui'
import { duration } from 'moment'
import { FC } from 'react'
// import '../../../../styles/tags.scss'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import './ResourceContributorCard.scss'
export type ResourceContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  timeSinceCreation: string
  creatorProfileHref: Href
}

export const ResourceContributorCard: FC<ResourceContributorCardProps> = ({
  avatarUrl,
  displayName,
  timeSinceCreation,
  creatorProfileHref,
}) => {
  const time = duration(new Date(timeSinceCreation).valueOf() - new Date().valueOf()).humanize()
  return (
    <Card className="resource-contributor-card" hideBorderWhenSmall={true}>
      <Link href={creatorProfileHref}>
        <img className="avatar" src={avatarUrl || defaultAvatar} alt="Avatar" />
      </Link>
      <div className="description">
        Uploaded {time} by <Link href={creatorProfileHref}>{displayName}</Link>
      </div>
    </Card>
  )
}
