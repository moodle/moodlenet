import Card from '../../../components/atoms/Card/Card'
import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import './styles.scss'

export type ContributorCardProps = {
  avatarUrl: string
  displayName: string
  timeSinceCreation: string
  creatorProfileHref: Href
}

export const ContributorCard = withCtrl<ContributorCardProps>(({ avatarUrl, displayName, timeSinceCreation, creatorProfileHref }) => {
  return (
    <Card className="contributor-card">
      <Link href={creatorProfileHref}><img className="avatar" src={avatarUrl} alt="Avatar" /></Link>
      <div className="description">
        Uploaded {timeSinceCreation} by <Link href={creatorProfileHref}>{displayName}</Link>
      </div>
    </Card>
  )
})
