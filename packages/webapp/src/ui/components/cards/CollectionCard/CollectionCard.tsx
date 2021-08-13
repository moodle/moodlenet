import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import './styles.scss'

export type CollectionCardProps = {
  imageUrl: string
  title: string
  collectionHref: Href
}

export const CollectionCard = withCtrl<CollectionCardProps>(({ imageUrl, title, collectionHref }) => {
  const background = {
    backgroundImage: 'url(' + imageUrl + ')',
    backgroundSize: 'cover',
  }

  return (
    <div className="collection-card" style={background}>
      <div className="title">
        <Link href={collectionHref}>
          <abbr title={title}>{title}</abbr>
        </Link>
      </div>
    </div>
  )
})
CollectionCard.displayName = 'CollectionCard'
CollectionCard.defaultProps = {}
