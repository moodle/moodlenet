import { Bookmark, BookmarkBorder, FilterNone, PermIdentity, Person } from '@material-ui/icons'
import {
  AddonItem,
  Card,
  Href,
  isEllipsisActive,
  TertiaryButton,
} from '@moodlenet/component-library'
import { getBackupImage, Link } from '@moodlenet/react-app/ui'
import { Public } from '@mui/icons-material'
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import './CollectionCard.scss'

export type CollectionCardData = {
  collectionId: string
  imageUrl?: string | null
  title: string
  collectionHref: Href
}

export type CollectionCardActions = {
  publish: () => void
  isPublished: boolean
  setIsPublished: Dispatch<SetStateAction<boolean>>
  bookmarked: boolean
  followed: boolean
  numFollowers: number
  numResource: number
  toggleFollow: () => unknown
  toggleBookmark: () => unknown
}

export type CollectionCardAccess = {
  isAuthenticated: boolean
  canEdit: boolean
  isCreator: boolean
}

export type CollectionCardProps = {
  mainColumnItems?: AddonItem[]
  topLeftItems?: AddonItem[]
  topRightItems?: AddonItem[]

  data: CollectionCardData
  actions: CollectionCardActions
  access: CollectionCardAccess
}

export const CollectionCard: FC<CollectionCardProps> = ({
  mainColumnItems,
  topLeftItems,
  topRightItems,

  data,
  actions,
  access,
}) => {
  const { collectionId, imageUrl, title, collectionHref } = data
  const {
    publish,
    isPublished,
    setIsPublished,
    bookmarked,
    followed,
    numFollowers,
    numResource,
    toggleFollow,
    toggleBookmark,
  } = actions
  const { isAuthenticated, canEdit, isCreator } = access

  const background = {
    background:
      'radial-gradient(120% 132px at 50% 55%, rgba(0, 0, 0, 0.4) 0%,  rgba(0, 0, 0, 0.2) 73%) 0% 0% / cover, url(' +
      (imageUrl || getBackupImage(collectionId)) +
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
        !isAuthenticated || isCreator ? 'disabled' : ''
      }`}
      abbr={
        isCreator
          ? 'Creators cannot follow their own content'
          : !isAuthenticated
          ? 'Loggin to follow the resource'
          : 'Follow'
      }
      onClick={
        isAuthenticated && !isCreator
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

  const titleRef = useRef<HTMLElement>(null)
  const [showTitleAbbr, setShowTitleAbbr] = useState(false)
  useEffect(() => {
    titleRef.current instanceof HTMLElement && setShowTitleAbbr(isEllipsisActive(titleRef.current))
  }, [titleRef])

  const contentContainer = (
    <Link href={collectionHref} className="collection-card-content">
      <abbr className="title" title={showTitleAbbr ? title : undefined} ref={titleRef}>
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
