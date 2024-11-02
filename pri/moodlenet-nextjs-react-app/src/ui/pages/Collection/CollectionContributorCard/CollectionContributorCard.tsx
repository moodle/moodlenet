import Link from 'next/link'
import type { FC } from 'react'
import { Card } from '../../../atoms/Card/Card'
import defaultAvatar from '../../../lib/assets/img/default-avatar.svg'
import './CollectionContributorCard.scss'
import { appRoute } from '../../../../lib/common/appRoutes'

export type CollectionContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  creatorProfileHref: appRoute
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
