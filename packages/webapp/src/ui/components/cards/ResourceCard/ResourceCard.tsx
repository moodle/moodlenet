import { default as BookmarkBorderIcon, default as BookmarkIcon } from '@material-ui/icons/BookmarkBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import DeleteButton from '../../atoms/DeleteButton/DeleteButton'
import './styles.scss'

export type ResourceCardProps = {
  tags: Array<string>
  image: string
  type: string //'Video' | 'Web Page' | 'Moodle Book'
  title: string
  resourceHomeHref: Href
  showRemoveButton?: boolean
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
    showRemoveButton,
    liked,
    numLikes,
    bookmarked,
    onRemoveClick,
    toggleLike,
    toggleBookmark,
  }) => {
    const tagSet = tags.map((value: string, index: number) => {
      return (
        <div key={index} className="tag">
          {value}
        </div>
      )
    })

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
      <div className="resource-card">
        <img className="image" src={image} alt="Background" />
        <div className="resource-card-header">
          <div className="main">
            <div className="type-and-actions">
              <div className="type" style={{ color: color }}>
                {type}
              </div>
              <div className="actions">
                <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
                  {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </div>
                <div className={`like ${liked && 'liked'}`} onClick={toggleLike}>
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  <span>{numLikes}</span>
                </div>
              </div>
            </div>
            <div className="title">
              <Link href={resourceHomeHref}>
                <abbr title={title}>{title}</abbr>
              </Link>
            </div>
          </div>
          <div className="tags scroll">{tagSet}</div>
        </div>
        {showRemoveButton && <DeleteButton className="remove" onClick={onRemoveClick} />}
      </div>
    )
  },
)
