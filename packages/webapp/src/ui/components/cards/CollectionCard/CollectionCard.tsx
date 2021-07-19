import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import './styles.scss'

export type CollectionCardProps = {
  imageUrl: string
  title: string
}

export const CollectionCard = withCtrl<CollectionCardProps>(({ imageUrl, title }) => {
  const background = {
    backgroundImage: 'url(' + imageUrl + ')',
    backgroundSize: 'cover',
  }

  return (
    <div className="collection-card" style={background}>
      <div className="title">
        <abbr title={title}>{title}</abbr>
      </div>
    </div>
  )
})
CollectionCard.displayName = 'CollectionCard'
CollectionCard.defaultProps = {}
