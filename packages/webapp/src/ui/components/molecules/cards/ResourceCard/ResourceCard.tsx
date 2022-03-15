import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { Href, Link } from '../../../../elements/link'
import { getTag, getTagList } from '../../../../elements/tags'
import { withCtrl } from '../../../../lib/ctrl'
import defaultAvatar from '../../../../static/img/default-avatar.svg'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import '../../../../styles/tags.scss'
import { FollowTag } from '../../../../types'
import Card from '../../../atoms/Card/Card'
import RoundButton from '../../../atoms/RoundButton/RoundButton'
import { Visibility } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
import './styles.scss'

export type ResourceCardProps = {
  toggleVisible?(): unknown
  tags?: FollowTag[]
  className?: string
  orientation?: 'vertical' | 'horizontal'
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
  owner: {
    displayName: string
    avatar: string | null
    profileHref: Href
  }
  onClick?(arg0: unknown): unknown
  onRemoveClick?(arg0: unknown): unknown
  toggleLike?: () => unknown
  toggleBookmark?: () => unknown
}

export const ResourceCard = withCtrl<ResourceCardProps>(
  ({
    orientation,
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
    owner,
    onClick,
    onRemoveClick,
    toggleLike,
    toggleBookmark,
  }) => {
    const avatar = {
      backgroundImage:
        'url(' + (owner.avatar ? owner.avatar : defaultAvatar) + ')',
      backgroundSize: 'cover',
    }
    let background = {}
    if (orientation === 'horizontal') {
      background = {
        background: 'url(' + (image ? image : defaultBackgroud) + ')',
      }
    } else {
      background = {
        background:
          'linear-gradient(0deg, rgba(0, 0, 0, 0.91) 0%, rgba(0, 0, 0, 0.1729) 45.15%, rgba(0, 0, 0, 0) 100%), url(' +
          (image ? image : defaultBackgroud) +
          ')',
      }
    }
    background = { ...background, backgroundSize: 'cover' }

    const content = () => (
      <div className="content">
        {orientation === 'horizontal' && (
          <div className="image" style={background} />
        )}
        <div
          className={`resource-card-content ${
            orientation === 'horizontal' ? 'horizontal' : 'vertical'
          }`}
        >
          <abbr className="title" title={title}>
            {title}
          </abbr>
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
        } ${orientation} ${
          isOwner && visibility === 'Private' ? 'is-private' : ''
        }`}
        hover={true}
        onClick={onClick}
        style={orientation === 'vertical' ? background : {}}
      >
        <div className={`resource-card-footer`}>
          <div className="left-side">
            <Link href={owner.profileHref}>
              <div style={avatar} className="avatar" />
              <span>{owner.displayName}</span>
            </Link>
          </div>
          <div className="right-side">
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
                  selectionMode || !isAuthenticated || isEditing
                    ? 'disabled'
                    : ''
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
        </div>
        {resourceHomeHref && !selectionMode ? (
          <Link href={resourceHomeHref}>{content()}</Link>
        ) : (
          <div className="content-container">{content()}</div>
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
          className={`tags scroll ${
            selectionMode ? 'disabled' : ''
          } ${orientation} ${isEditing ? 'editing' : ''}`}
        >
          {getTag(
            {
              type: 'type',
              name: type,
            },
            orientation === 'horizontal' ? 'small' : 'big',
            undefined,
            undefined,
            { backgroundColor: color }
          )}
          {tags &&
            getTagList(tags, orientation === 'horizontal' ? 'small' : 'big')}
        </div>
      </Card>
    )
  }
)

ResourceCard.defaultProps = {
  orientation: 'horizontal',
  selectionMode: false,
}

export default ResourceCard
