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
import { Bookmark, BookmarkBorder, Favorite, FavoriteBorder } from '@material-ui/icons'
import { AddonItem, Card, FollowTag, Href, TertiaryButton } from '@moodlenet/component-library'
import { getBackupImage, Link } from '@moodlenet/react-app/ui'
import { CloseRounded, Public } from '@mui/icons-material'
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { getResourceTypeInfo } from '../../../../common.mjs'
import './ResourceCard.scss'

export type ResourceCardProps = {
  mainColumnItems?: AddonItem[]
  topLeftItems?: AddonItem[]
  topRightItems?: AddonItem[]
  bottomLeftItems?: AddonItem[]
  bottomRightItems?: AddonItem[]

  resourceId: string
  tags?: FollowTag[]
  className?: string
  orientation?: 'vertical' | 'horizontal'
  image?: string | null
  type: string //'Video' | 'Web Page' | 'Moodle Book'
  title: string

  publish: () => void
  isPublished: boolean
  setIsPublished: Dispatch<SetStateAction<boolean>>
  resourceHomeHref?: Href
  isOwner: boolean
  canEdit: boolean
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
  mainColumnItems,
  topLeftItems,
  topRightItems,
  bottomLeftItems,
  bottomRightItems,

  resourceId,
  orientation,
  isSelected,
  image,
  type,
  title,
  resourceHomeHref,
  canEdit,
  selectionMode,
  isAuthenticated,
  liked,
  numLikes,
  bookmarked,
  isOwner,

  publish,
  isPublished,
  setIsPublished,
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
      <div className={`resource-card-content ${orientation ?? ''} ${size}`}>
        <abbr className={`title ${orientation ?? ''}`} title={title}>
          <span>{title}</span>
        </abbr>
      </div>
    </div>
  )

  useEffect(() => {
    const updateSize = () => {
      console.log('width ', resourceCard.current && resourceCard.current.clientWidth)
      setSize(
        resourceCard.current && resourceCard.current.clientWidth < 300
          ? 'micro'
          : resourceCard.current && resourceCard.current.clientWidth < 400
          ? 'tiny'
          : resourceCard.current && resourceCard.current.clientWidth < 500
          ? 'small'
          : resourceCard.current && resourceCard.current.clientWidth < 700
          ? 'medium'
          : 'big',
      )
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [resourceCard])

  const deleteButton = canEdit && (
    <TertiaryButton onClick={onRemoveClick} className={`delete ${orientation}`}>
      <CloseRounded />
    </TertiaryButton>
  )

  const typeLabel = (
    <div className="type" style={{ background: typeColor }}>
      {typeName}
    </div>
  )

  const updatedTopLeftItems = [typeLabel, ...(topLeftItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const updatedTopRightItems = [deleteButton, ...(topRightItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const header = (
    <div className={`resource-card-header ${orientation} ${size}`}>
      <div className="header-left">
        {updatedTopLeftItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="header-right">
        {updatedTopRightItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      {/* <div className={`level`}>
        <div className="name">
        L1
        </div>
      </div> */}
    </div>
  )

  const avatarLabel = (
    <Link href={owner.profileHref}>
      <div style={avatar} className="avatar" />
      <span>{owner.displayName}</span>
    </Link>
  )

  const pulishButton = canEdit && (
    <TertiaryButton
      onClick={isPublished ? () => setIsPublished(false) : publish}
      className={`publish-button ${isPublished ? 'published' : 'draft'}`}
      abbr={isPublished ? 'Sent to draft' : 'Publish'}
    >
      <Public />
    </TertiaryButton>
  )

  const bookmarkButton = isAuthenticated && !selectionMode && (
    <TertiaryButton
      className={`bookmark-button ${bookmarked && 'bookmarked'} ${
        selectionMode || !isAuthenticated ? 'disabled' : ''
      }`}
      onClick={toggleBookmark}
      abbr="Bookmark"
    >
      {bookmarked ? <Bookmark /> : <BookmarkBorder />}
    </TertiaryButton>
  )

  const likeButton = (
    <TertiaryButton
      className={`like-button ${liked && 'liked'} ${
        selectionMode || !isAuthenticated || isOwner ? 'disabled' : ''
      }`}
      abbr={
        isOwner
          ? 'Creators cannot like their own content'
          : !isAuthenticated
          ? 'Loggin to like the resource'
          : 'Like'
      }
      onClick={
        isAuthenticated && !isOwner && !selectionMode
          ? toggleLike
          : (e: React.MouseEvent<HTMLElement>) => e.stopPropagation()
      }
    >
      {liked ? <Favorite /> : <FavoriteBorder />}
      <span>{numLikes}</span>
    </TertiaryButton>
  )

  const updatedBottomLeftItems = [avatarLabel, ...(bottomLeftItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const updatedBottomRightItems = [
    bookmarkButton,
    likeButton,
    pulishButton,
    ...(bottomRightItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const footer = (
    <div className={`resource-card-footer ${orientation} ${size}`}>
      <div className="footer-left">
        {updatedBottomLeftItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="footer-right">
        {updatedBottomRightItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )

  const contentContainer =
    resourceHomeHref && !selectionMode ? (
      <Link className="content-container" href={resourceHomeHref}>
        {content}
      </Link>
    ) : (
      <div className="content-container">{content}</div>
    )

  const updatedMainColumnItems = [
    header,
    contentContainer,
    footer,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  return (
    <Card
      ref={resourceCard}
      className={`resource-card ${isSelected ? 'selected' : ''} ${orientation} ${
        isOwner && isPublished ? '' : 'is-private'
      }`}
      hover={true}
      onClick={onClick}
      style={orientation === 'vertical' ? background : {}}
    >
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </Card>
  )
}

export default ResourceCard
