import { Card } from '@moodlenet/component-library'
import { Href, Link } from '@moodlenet/react-app/ui'
import { FC } from 'react'
// import '../../../../styles/tags.scss'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import './ContributorCard.scss'

export type ContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  timeSinceCreation: string
  creatorProfileHref: Href
}

export const ContributorCard: FC<ContributorCardProps> = ({
  avatarUrl,
  displayName,
  timeSinceCreation,
  creatorProfileHref,
}) => {
  return (
    <Card className="contributor-card" hideBorderWhenSmall={true}>
      <Link href={creatorProfileHref}>
        <img className="avatar" src={avatarUrl || defaultAvatar} alt="Avatar" />
      </Link>
      <div className="description">
        Uploaded {timeSinceCreation} by <Link href={creatorProfileHref}>{displayName}</Link>
      </div>
    </Card>
  )
}
