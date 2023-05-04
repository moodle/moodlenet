import { Card } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import './CollectionContributorCard.scss'

export type CollectionContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  creatorProfileHref: Href
}

export const CollectionContributorCard: FC<CollectionContributorCardProps> = ({
  avatarUrl,
  displayName,
  creatorProfileHref,
}) => {
  return (
    <Card className="collection-contributor-card" hideBorderWhenSmall={true}>
      <Link href={creatorProfileHref}>
        <img className="avatar" src={avatarUrl || defaultAvatar} alt="Avatar" />
      </Link>
      <div className="description">
        Collection curated by <Link href={creatorProfileHref}>{displayName}</Link>
      </div>
    </Card>
  )
}
