import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { Href, Link } from '../../../../elements/link'
import { getTagList } from '../../../../elements/tags'
import { withCtrl } from '../../../../lib/ctrl'
import '../../../../styles/tags.scss'
import { FollowTag } from '../../../../types'
import Card from '../../../atoms/Card/Card'
import RoundButton from '../../../atoms/RoundButton/RoundButton'
import { Visibility } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
import './styles.scss'

export type ResourceCardLegacyProps = {
  toggleVisible?(): unknown
  tags?: FollowTag[]
  className?: string
  direction?: 'vertical' | 'horizontal'
  image: string | null
  type: string //'Video' | 'Web Page' | 'Moodle Book'
  title: string
  visibility: Visibility
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

export const ResourceCardLegacy = withCtrl<ResourceCardLegacyProps>(
  ({
    direction,
    isSelected,
    toggleVisible,
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
    visibility,
    onClick,
    onRemoveClick,
    toggleLike,
    toggleBookmark,
  }) => {
    const background = {
      backgroundImage: `url("${image ? image : ''}")`,
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
        color = '#2A75C0'
        break
      case 'Web Page':
        color = '#C233C7'
        break
      default:
        color = '#15845A'
    }

    return (
      <Card
        className={`resource-card ${
          isSelected ? 'selected' : ''
        } ${direction} ${
          isOwner && visibility === 'Private' ? 'is-private' : ''
        }`}
        hover={true}
        onClick={onClick}
      >
        <div className={`actions`}>
          {isOwner && (
            <abbr
              onClick={toggleVisible}
              className={`visibility ${
                visibility === 'Public' ? 'public' : 'private'
              }`}
              title={visibility}
            >
              {visibility === 'Public' ? (
                <VisibilityIcon />
              ) : (
                <VisibilityOffIcon />
              )}
            </abbr>
          )}
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
            className={`like ${liked && 'liked'} ${
              selectionMode || !isAuthenticated || isOwner ? 'disabled' : ''
            }`}
            {...(isAuthenticated &&
              !isOwner &&
              !selectionMode && { onClick: toggleLike })}
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
        {isEditing && (
          <RoundButton
            className="delete"
            type="trash"
            color="red"
            onHoverColor="fill-red"
            onClick={onRemoveClick}
          />
        )}
        <div
          className={`tags scroll ${selectionMode ? 'disabled' : ''} ${
            isEditing ? 'editing' : ''
          }`}
        >
          {tags && getTagList(tags, 'small')}
        </div>
      </Card>
    )
  }
)

ResourceCardLegacy.defaultProps = {
  direction: 'horizontal',
  selectionMode: false,
}

export default ResourceCardLegacy
