import moment from 'moment'
import type { FC } from 'react'
// import '../../../../styles/tags.scss'
import Link from 'next/link'
import { appRoute } from '../../../../lib/common/appRoutes'
import defaultAvatar from '../../../lib/assets/img/default-avatar.svg'
import { Card } from '../../../atoms/Card/Card'
import './ResourceContributorCard.scss'
export type ResourceContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  timeSinceCreation: string
  creatorProfileHref: appRoute
}
export const ResourceContributorCard: FC<ResourceContributorCardProps> = ({
  avatarUrl,
  displayName,
  timeSinceCreation,
  creatorProfileHref,
}) => {
  const originalTime = new Date(timeSinceCreation).valueOf()
  const time = originalTime ? moment.duration(new Date(timeSinceCreation).valueOf() - new Date().valueOf()).humanize() : null
  return (
    <Card className="resource-contributor-card" hideBorderWhenSmall={true}>
      <Link href={creatorProfileHref}>
        <img className="avatar" src={avatarUrl || defaultAvatar} alt="Avatar" />
      </Link>
      <div className="description">
        Uploaded {time && `${time} ago`} by <Link href={creatorProfileHref}>{displayName}</Link>
      </div>
    </Card>
  )
}
