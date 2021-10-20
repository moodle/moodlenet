import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { Href, Link } from '../../../../elements/link'
import { tagList } from '../../../../elements/tags'
import { withCtrl } from '../../../../lib/ctrl'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import '../../../../styles/tags.css'
import { FollowTag } from '../../../../types'
import Card from '../../../atoms/Card/Card'
import RoundButton from '../../../atoms/RoundButton/RoundButton'
import './styles.scss'

export type ResourceCardProps = {
  tags?: FollowTag[]
  className?: string
  direction?: 'vertical' | 'horizontal'
  image: string | null
  type: string //'Video' | 'Web Page' | 'Moodle Book'
  title: string
  resourceHomeHref?: Href
  isOwner: boolean
  isEditing?: boolean
  isAuthenticated?: boolean
  isSelected?: boolean
  selectionMode?: boolean
  liked: boolean
  numLikes: number
  bookmarked: boolean
  onClick?(arg0: unknown): unknown
  onRemoveClick?(arg0: unknown): unknown
  toggleLike?: () => unknown
  toggleBookmark?: () => unknown
}

export const ResourceCard = withCtrl<ResourceCardProps>(
  ({
    direction,
    isSelected,
    tags,
    image,
    type,
    title,
    resourceHomeHref,
    isEditing,
    selectionMode,
    isAuthenticated,
    liked,
    numLikes,
    bookmarked,
    isOwner,
    onClick,
    onRemoveClick,
    toggleLike,
    toggleBookmark,
  }) => {
    const background = {
      backgroundImage: 'url(' + (image ? image : defaultBackgroud) + ')',
      backgroundSize: 'cover',
    }

    const content = (color: string) => (
      <div className="content">
        <div className="image" style={background} /> 
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
      </div>
    )

    let color: string = ''
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
      <Card className={`resource-card ${isSelected ? 'selected' : ''} ${direction}`} hover={true} onClick={onClick}>
        <div className={`actions`}>
          {isAuthenticated && !selectionMode && (
            <div
              className={`bookmark ${bookmarked && 'bookmarked'} ${
                selectionMode || !isAuthenticated || isEditing ? 'disabled' : ''
              }`}
              onClick={toggleBookmark}
            >
              {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </div>
          )}
          <div
            className={`like ${liked && 'liked'} ${selectionMode || !isAuthenticated || isOwner ? 'disabled' : ''}`}
            {...(isAuthenticated && !isOwner && !selectionMode && { onClick: toggleLike })}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <span>{numLikes}</span>
          </div>
        </div>
        {resourceHomeHref && !selectionMode ? (
          <Link href={resourceHomeHref}>{content(color)}</Link>
        ) : (
          <div className="content-container">{content(color)}</div>
        )}
        {isEditing && <RoundButton className="remove" type="trash" color="red" onHoverColor="fill-red" onClick={onRemoveClick} />}
        <div className={`tags scroll ${selectionMode ? 'disabled' : ''} ${isEditing ? 'editing' : ''}`}>
          {tags && tagList(tags)}
        </div>
      </Card>
    )
  },
)

ResourceCard.defaultProps = {
  direction: 'horizontal',
}

export default ResourceCard
