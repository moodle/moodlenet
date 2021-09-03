import { default as BookmarkBorderIcon, default as BookmarkIcon } from '@material-ui/icons/BookmarkBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { Href, Link } from '../../../elements/link'
import { tagList } from '../../../elements/tags'
import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import { FollowTag } from '../../../types'
import Card from '../../atoms/Card/Card'
import DeleteButton from '../../atoms/DeleteButton/DeleteButton'
import './styles.scss'

export type ResourceCardProps = {
  tags: FollowTag[]
  image: string
  type: string //'Video' | 'Web Page' | 'Moodle Book'
  title: string
  resourceHomeHref: Href
  isEditing?: boolean
  isAuthenticated?: boolean
  liked: boolean
  numLikes: number
  bookmarked: boolean
  onRemoveClick?(arg0: unknown): unknown
  toggleLike?: () => unknown
  toggleBookmark?: () => unknown
}

export const ResourceCard = withCtrl<ResourceCardProps>(
  ({
    tags,
    image,
    type,
    title,
    resourceHomeHref,
    isEditing,
    isAuthenticated,
    liked,
    numLikes,
    bookmarked,
    onRemoveClick,
    toggleLike,
    toggleBookmark,
  }) => {
    let color = ''
    switch (type) {
      case 'Video':
        color = '#2c7bcb'
        break
      case 'Web Page':
        color = '#cc4fd1'
        break
      default:
        color = '#20c184'
    }

    return (
      <Card className="resource-card">
        <div className="actions">
          {isAuthenticated && (
          <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
            {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </div>
          )}
          <div className={`like ${liked && 'liked'}`} onClick={isAuthenticated ? toggleLike : () => {}}>
            {(liked) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <span>{numLikes}</span>
          </div>
        </div>
        <Link href={resourceHomeHref}>
        <img className="image" src={image} alt="Background" />
        <div className="resource-card-header">
          <div className="type-and-actions">
            <div className="type" style={{ color: color }}>
              {type}
            </div>
          </div>
          <div className="title">
              <abbr title={title}>{title}</abbr>
          </div>
        </div>
        </Link>
        {isEditing && <DeleteButton className="remove" type="trash" onClick={onRemoveClick} />}
        <div className="tags scroll">{tagList(tags)}</div>
      </Card>
    )
  },
)
