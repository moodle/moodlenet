import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import PersonIcon from '@material-ui/icons/Person'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { Href, Link } from '../../../../elements/link'
import { withCtrl } from '../../../../lib/ctrl'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import '../../../../styles/tags.css'
import Card from '../../../atoms/Card/Card'
import { Visibility } from '../../../pages/NewResource/FieldsData'
import './styles.scss'

export type CollectionCardProps = {
  imageUrl: string | null
  title: string
  visibility: Visibility
  collectionHref: Href
  isAuthenticated: boolean
  isOwner: boolean
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
    visibility,
    isAuthenticated,
    isOwner,
    bookmarked,
    following,
    numFollowers,
    toggleBookmark,
    toggleFollow,
    collectionHref,
  }) => {
    const background = {
      backgroundImage: 'url(' + (imageUrl || defaultBackgroud) + ')',
      backgroundSize: 'cover',
    }

    return (
      <Card
        className={`collection-card ${isOwner && visibility === 'Private' ? 'is-private' : ''}`}
        style={background}
        hover={true}
      >
        <div className={`actions`}>
          <div
            className={`follow ${following ? 'following' : ''} ${!isAuthenticated || isOwner ? 'disabled' : ''}`}
            onClick={isAuthenticated && !isOwner ? toggleFollow : () => {}}
          >
            {following ? <PersonIcon /> : <PermIdentityIcon />}
            <span>{numFollowers}</span>
          </div>
          <div className="right">
            {isOwner && (
              <abbr className={`visibility ${visibility === 'Public' ? 'public' : 'private'}`} title={visibility}>
                {visibility === 'Public' ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </abbr>
            )}
            {isAuthenticated && (
              <div className={`bookmark ${bookmarked ? 'bookmarked' : ''}`} onClick={toggleBookmark}>
                {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </div>
            )}
          </div>
        </div>
        <Link href={collectionHref}>
          <div className="title">
            <abbr title={title}>{title}</abbr>
          </div>
        </Link>
      </Card>
    )
  },
)
CollectionCard.displayName = 'CollectionCard'
CollectionCard.defaultProps = {}
