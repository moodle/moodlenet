// import BookmarkIcon from '@material-ui/icons/Bookmark'
// import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
// import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
// import FavoriteIcon from '@material-ui/icons/Favorite'
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
// import VisibilityIcon from '@material-ui/icons/Visibility'
// import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
// import { useEffect, useRef, useState } from 'react'
// import { getBackupImage } from '../../../../../helpers/utilities'
// import { Href, Link } from '../../../../elements/link'
// import { withCtrl } from '../../../../lib/ctrl'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
// import '../../../../styles/tags.scss'
// import { FollowTag, getResourceTypeInfo } from '../../../../types'
// import Card from '../../../atoms/Card/Card'
// import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
// import { Visibility } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
import { Link } from '@material-ui/core'
import {
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteBorder,
  Visibility as VisibilityIcon,
  VisibilityOff,
} from '@material-ui/icons'
import { Card, FollowTag, Href, TertiaryButton, Visibility } from '@moodlenet/component-library'
import { getBackupImage } from '@moodlenet/react-app/ui'
import { CloseRounded } from '@mui/icons-material'
import { FC, useEffect, useRef, useState } from 'react'
import { getResourceTypeInfo } from '../../../../common.mjs'
import './ResourceCard.scss'

export type ResourceCardProps = {
  resourceId: string
  toggleVisible?(): unknown
  tags?: FollowTag[]
  className?: string
  orientation?: 'vertical' | 'horizontal'
  image?: string | null
  type: string //'Video' | 'Web Page' | 'Moodle Book'
  title: string
  visibility: Visibility
  resourceHomeHref?: Href
  allowDeletion?: boolean
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

export const ResourceCard: FC<ResourceCardProps> = ({
  resourceId,
  orientation,
  isSelected,
  toggleVisible,
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
  allowDeletion,
  owner,
  onClick,
  onRemoveClick,
  toggleLike,
  toggleBookmark,
}) => {
  const resourceCard = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<'micro' | 'tiny' | 'small' | 'medium' | 'big'>('medium')

  const { typeName, typeColor } = getResourceTypeInfo(type)

  const avatar = {
    backgroundImage: 'url("' + (owner.avatar ? owner.avatar : defaultAvatar) + '")',
    backgroundSize: 'cover',
  }
  let background = {}
  if (orientation === 'horizontal') {
    background = {
      background: 'url("' + (image ? image : getBackupImage(resourceId)?.location) + '")',
    }
  } else {
    background = {
      background:
        'linear-gradient(0deg, rgba(0, 0, 0, 0.91) 0%, rgba(0, 0, 0, 0.1729) 45.15%, rgba(0, 0, 0, 0) 100%), url(' +
        (image ? image : getBackupImage(resourceId)?.location) +
        ')',
    }
  }
  background = { ...background, backgroundSize: 'cover' }

  const content = (
    <div className="content">
      {orientation === 'horizontal' && <div className={`image ${size}`} style={background} />}
      <div
        className={`resource-card-content ${
          orientation === 'horizontal' ? 'horizontal' : 'vertical'
        } ${size}`}
      >
        <abbr className="title" title={title}>
          <span>{title}</span>
        </abbr>
      </div>
    </div>
  )

  useEffect(() => {
    const updateSize = () => {
      setSize(
        resourceCard.current && resourceCard.current.clientWidth < 200
          ? 'micro'
          : resourceCard.current && resourceCard.current.clientWidth < 300
          ? 'tiny'
          : resourceCard.current && resourceCard.current.clientWidth < 385
          ? 'small'
          : resourceCard.current && resourceCard.current.clientWidth < 575
          ? 'medium'
          : 'big',
      )
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [resourceCard])

  return (
    <Card
      // ref={resourceCard}
      className={`resource-card ${isSelected ? 'selected' : ''} ${orientation} ${
        isOwner && visibility === 'Private' ? 'is-private' : ''
      }`}
      hover={true}
      onClick={onClick}
      style={orientation === 'vertical' ? background : {}}
    >
      <div className={`resource-card-header ${orientation} ${size}`}>
        <div className="left-side">
          <div className="type" style={{ background: typeColor }}>
            {typeName}
          </div>
        </div>
        <div className="right-side">
          {isEditing && allowDeletion && (
            <TertiaryButton onClick={onRemoveClick} className="delete">
              <CloseRounded />
            </TertiaryButton>
          )}
        </div>
        {/* <div className={`level`}>
            <div className="name">
              L1
            </div>
          </div> */}
      </div>
      <div className={`resource-card-footer ${orientation} ${size}`}>
        <div className="left-side">
          <Link
          // href={owner.profileHref}
          >
            <div style={avatar} className="avatar" />
            {size !== 'micro' && <span>{owner.displayName}</span>}
          </Link>
        </div>
        <div className="right-side">
          {isOwner && (
            <abbr
              onClick={toggleVisible}
              className={`visibility ${visibility === 'Public' ? 'public' : 'private'}`}
              title={visibility}
            >
              {visibility === 'Public' ? <VisibilityIcon /> : <VisibilityOff />}
            </abbr>
          )}
          {isAuthenticated && !selectionMode && (
            <div
              className={`bookmark ${bookmarked && 'bookmarked'} ${
                selectionMode || !isAuthenticated ? 'disabled' : ''
              }`}
              onClick={toggleBookmark}
            >
              {bookmarked ? <Bookmark /> : <BookmarkBorder />}
            </div>
          )}
          <div
            className={`like ${liked && 'liked'} ${
              selectionMode || !isAuthenticated || isOwner ? 'disabled' : ''
            }`}
            {...(isAuthenticated && !isOwner && !selectionMode
              ? { onClick: toggleLike }
              : {
                  onClick: e => {
                    e.stopPropagation()
                  },
                })}
          >
            {liked ? <Favorite /> : <FavoriteBorder />}
            <span>{numLikes}</span>
          </div>
        </div>
      </div>
      {resourceHomeHref && !selectionMode ? (
        <Link
        // href={resourceHomeHref}
        >
          {content}
        </Link>
      ) : (
        <div className="content-container">{content}</div>
      )}
    </Card>
  )
}

export default ResourceCard
