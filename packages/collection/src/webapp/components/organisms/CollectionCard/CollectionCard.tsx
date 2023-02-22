// import BookmarkIcon from '@material-ui/icons/Bookmark'
// import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
// import FilterNoneIcon from '@material-ui/icons/FilterNone'
// import PermIdentityIcon from '@material-ui/icons/PermIdentity'
// import PersonIcon from '@material-ui/icons/Person'
// import VisibilityIcon from '@material-ui/icons/Visibility'
// import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
// import { getBackupImage } from '../../../../../helpers/utilities'
// import { Href, Link } from '../../../../elements/link'
// import { withCtrl } from '../../../../lib/ctrl'
// import '../../../../styles/tags.scss'
// import Card from '../../../atoms/Card/Card'
// import { Visibility } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
import { Bookmark, BookmarkBorder, FilterNone, PermIdentity, Person } from '@material-ui/icons'
import { AddonItem, Card, Href, TertiaryButton } from '@moodlenet/component-library'
import { getBackupImage, Link } from '@moodlenet/react-app/ui'
import { Public } from '@mui/icons-material'
import { Dispatch, FC, SetStateAction } from 'react'
import './CollectionCard.scss'

export type CollectionCardProps = {
  mainColumnItems?: AddonItem[]
  topLeftItems?: AddonItem[]
  topRightItems?: AddonItem[]

  collectionId: string
  imageUrl?: string | null
  title: string
  collectionHref: Href

  publish: () => void
  isPublished: boolean
  setIsPublished: Dispatch<SetStateAction<boolean>>

  isAuthenticated: boolean
  canEdit: boolean
  isOwner: boolean

  bookmarked: boolean
  followed: boolean
  numFollowers: number
  numResource: number
  toggleFollow?: () => unknown
  toggleBookmark?: () => unknown
}

export const CollectionCard: FC<CollectionCardProps> = ({
  mainColumnItems,
  topLeftItems,
  topRightItems,

  collectionId,
  imageUrl,
  title,
  collectionHref,

  isPublished,
  setIsPublished,
  publish,

  canEdit,
  isAuthenticated,
  isOwner,

  bookmarked,
  followed,
  numFollowers,
  numResource,
  toggleBookmark,
  toggleFollow,
}) => {
  const background = {
    background:
      'radial-gradient(120% 132px at 50% 55%, rgba(0, 0, 0, 0.4) 0%,  rgba(0, 0, 0, 0.2) 73%) 0% 0% / cover, url(' +
      (imageUrl || getBackupImage(collectionId)?.location) +
      ')',
    backgroundSize: 'cover',
  }

  const numResources = (
    <div className="num-resources">
      <FilterNone />
      {numResource}
    </div>
  )

  const publishButton = canEdit && (
    <TertiaryButton
      onClick={isPublished ? () => setIsPublished(false) : publish}
      className={`publish-button ${isPublished ? 'published' : 'draft'}`}
      abbr={isPublished ? 'Sent to draft' : 'Publish'}
    >
      <Public />
    </TertiaryButton>
  )

  const bookmarkButton = isAuthenticated && (
    <TertiaryButton
      className={`bookmark-button ${bookmarked ? 'bookmarked' : ''}`}
      onClick={toggleBookmark}
      abbr="Bookmark"
    >
      {bookmarked ? <Bookmark /> : <BookmarkBorder />}
    </TertiaryButton>
  )

  const followButton = (
    <TertiaryButton
      className={`follow-button ${followed ? 'followed' : ''} ${
        !isAuthenticated || isOwner ? 'disabled' : ''
      }`}
      abbr={
        isOwner
          ? 'Creators cannot follow their own content'
          : !isAuthenticated
          ? 'Loggin to follow the resource'
          : 'Follow'
      }
      onClick={
        isAuthenticated && !isOwner
          ? toggleFollow
          : (e: React.MouseEvent<HTMLElement>) => e.stopPropagation()
      }
    >
      {followed ? <Person /> : <PermIdentity />}
      <span>{numFollowers}</span>
    </TertiaryButton>
  )

  const updatedTopLeftItems = [numResources, ...(topLeftItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const updatedTopRightItems = [
    bookmarkButton,
    followButton,
    publishButton,
    ...(topRightItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const header = (
    <div className={`collection-card-header`}>
      <div className="header-left">
        {updatedTopLeftItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="header-right">
        {updatedTopRightItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )

  const contentContainer = (
    <Link href={collectionHref} className="collection-card-content">
      <abbr className="title" title={title}>
        {title}
      </abbr>
    </Link>
  )

  const updatedMainColumnItems = [header, contentContainer, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  return (
    <Card
      className={`collection-card ${isPublished ? 'published' : 'draft'}`}
      style={background}
      hover={true}
    >
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </Card>
  )
}

CollectionCard.displayName = 'CollectionCard'
