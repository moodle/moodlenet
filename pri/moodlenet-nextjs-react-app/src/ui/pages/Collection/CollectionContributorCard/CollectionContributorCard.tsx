import Link from 'next/link'
import type { FC } from 'react'
import { Card } from '../../../atoms/Card/Card'
import defaultAvatar from '../../../lib/assets/img/default-avatar.svg'
import './CollectionContributorCard.scss'
import { appRoute } from '../../../../lib/common/appRoutes'

export type collectionContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  creatorProfileHref: appRoute
}

export function CollectionContributorCard({ avatarUrl, displayName, creatorProfileHref }: collectionContributorCardProps) {
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
