import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import PersonIcon from '@material-ui/icons/Person'
import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import './styles.scss'

export type CollectionCardProps = {
  imageUrl: string
  title: string
  collectionHref: Href
  isAuthenticated: boolean
  isEditing?: boolean
  bookmarked: boolean
  following: boolean
  numFollowers: number
  toggleFollow?: () => unknown
  toggleBookmark?: () => unknown
}

export const CollectionCard = withCtrl<CollectionCardProps>(
  ({
    imageUrl,
    title,
    isAuthenticated,
    bookmarked,
    following,
    numFollowers,
    toggleBookmark,
    toggleFollow,
    collectionHref,
  }) => {
    const background = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'cover',
    }

    return (
      <div className="collection-card" style={background}>
        <div className={`actions`}>
          <div className={`follow ${following ? 'following' : ''}`} onClick={isAuthenticated ? toggleFollow : () => {}}>
            {following ? <PersonIcon /> : <PermIdentityIcon />}
            <span>{numFollowers}</span>
          </div>
          {isAuthenticated && (
            <div className={`bookmark ${bookmarked ? 'bookmarked' : ''}`} onClick={toggleBookmark}>
              {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </div>
          )}
        </div>
        <Link href={collectionHref}>
          <div className="title">
            <abbr title={title}>{title}</abbr>
          </div>
        </Link>
      </div>
    )
  },
)
CollectionCard.displayName = 'CollectionCard'
CollectionCard.defaultProps = {}
