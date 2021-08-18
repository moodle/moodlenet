import { default as BookmarkBorderIcon, default as BookmarkIcon } from '@material-ui/icons/BookmarkBorder'
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
          <div>
            {isAuthenticated && (
              <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
                {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </div>
            )}
            <div className={`${following && 'following follow'}`} onClick={isAuthenticated ? toggleFollow : () => {}}>
              {following ? <PersonIcon /> : <PermIdentityIcon />}
              <span>{numFollowers}</span>
            </div>
          </div>
        </div>
        <div className="title">
          <Link href={collectionHref}>
            <abbr title={title}>{title}</abbr>
          </Link>
        </div>
      </div>
    )
  },
)
CollectionCard.displayName = 'CollectionCard'
CollectionCard.defaultProps = {}
