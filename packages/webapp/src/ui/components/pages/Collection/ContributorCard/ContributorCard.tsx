import { Href, Link } from '../../../../elements/link'
import { withCtrl } from '../../../../lib/ctrl'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import '../../../../styles/tags.scss'
import Card from '../../../atoms/Card/Card'
import './styles.scss'

export type ContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  creatorProfileHref: Href
}

export const ContributorCard = withCtrl<ContributorCardProps>(
  ({ avatarUrl, displayName, creatorProfileHref }) => {
    return (
      <Card className="contributor-card" hideBorderWhenSmall={true}>
        <Link href={creatorProfileHref}>
          <img
            className="avatar"
            src={avatarUrl || defaultBackgroud}
            alt="Avatar"
          />
        </Link>
        <div className="description">
          Collection Curated by{' '}
          <Link href={creatorProfileHref}>{displayName}</Link>
        </div>
      </Card>
    )
  }
)
