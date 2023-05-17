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
import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  getThumbnailFromUrl,
  isEllipsisActive,
  TertiaryButton,
} from '@moodlenet/component-library'
import { getBackupImage, Link, withProxy } from '@moodlenet/react-app/ui'
import { Public } from '@mui/icons-material'
import { useEffect, useRef, useState } from 'react'
import type {
  ResourceCardAccess,
  ResourceCardActions,
  ResourceCardDataProps,
  ResourceCardState,
} from '../../../../common/types.mjs'
import { getResourceTypeInfo } from '../../../../common/types.mjs'
import './ResourceCard.scss'

export type ResourceCardProps = ResourceCardPropsData & ResourceCardPropsUI

export type ResourceCardPropsData = {
  mainColumnItems: (AddonItem | null)[]
  topLeftItems: (AddonItem | null)[]
  topRightItems: (AddonItem | null)[]
  bottomLeftItems: (AddonItem | null)[]
  bottomRightItems: (AddonItem | null)[]

  data: ResourceCardDataProps
  state: ResourceCardState
  actions: ResourceCardActions
  access: ResourceCardAccess
}

type ResourceCardPropsUI = {
  className?: string
  orientation?: 'vertical' | 'horizontal'
}

export const ResourceCard = withProxy<ResourceCardProps>(
  ({
    mainColumnItems,
    topLeftItems,
    topRightItems,
    bottomLeftItems,
    bottomRightItems,

    className,
    orientation = 'vertical',

    data,
    state,
    actions,
    access,
  }) => {
    const {
      resourceId,
      contentUrl,
      imageUrl,
      title,
      // numLikes,
      owner,
      resourceHomeHref,
      contentType,
      downloadFilename,
    } = data
    const {
      // liked,
      // bookmarked,
      isPublished,
      // isSelected,
      // selectionMode,
    } = state
    const {
      // toggleLike,
      //  toggleBookmark,
      publish,
      unpublish,
    } = actions
    const {
      canPublish,
      // canLike,
      // isCreator,
      // isAuthenticated,
    } = access

    const resourceCard = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState<'micro' | 'tiny' | 'small' | 'medium' | 'big'>('medium')

    const { typeName, typeColor } = getResourceTypeInfo(
      contentType,
      contentType === 'file' ? downloadFilename : contentUrl,
    )

    const thumbnail = contentUrl && getThumbnailFromUrl(contentUrl)

    const avatar = {
      backgroundImage: 'url("' + (owner.avatar ? owner.avatar : defaultAvatar) + '")',
      backgroundSize: 'cover',
    }
    let background = {}
    if (orientation === 'horizontal') {
      background = {
        background:
          'url("' +
          (thumbnail ? thumbnail : imageUrl ? imageUrl : getBackupImage(resourceId)) +
          '")',
      }
    } else {
      background = {
        background:
          'linear-gradient(0deg, rgba(0, 0, 0, 0.91) 0%, rgba(0, 0, 0, 0.1729) 45.15%, rgba(0, 0, 0, 0) 100%), url(' +
          (thumbnail ? thumbnail : imageUrl ? imageUrl : getBackupImage(resourceId)) +
          ')',
      }
    }
    background = { ...background, backgroundSize: 'cover', backgroundPosition: 'center center' }

    const titleRef = useRef<HTMLElement>(null)
    const [showTitleAbbr, setShowTitleAbbr] = useState(false)
    useEffect(() => {
      titleRef.current instanceof HTMLElement &&
        setShowTitleAbbr(isEllipsisActive(titleRef.current))
    }, [titleRef])

    const content = (
      <div className="content">
        {orientation === 'horizontal' && <div className={`image ${size}`} style={background} />}
        <div className={`resource-card-content ${orientation ?? ''} ${size}`}>
          <abbr className={`title ${orientation ?? ''}`} {...(showTitleAbbr && { title: title })}>
            <span ref={titleRef}>{title}</span>
          </abbr>
        </div>
      </div>
    )

    useEffect(() => {
      const updateSize = () => {
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

    const typeLabel =
      typeName && typeColor ? (
        <div className="type" key="type-label" style={{ background: typeColor }}>
          {typeName}
        </div>
      ) : null

    const updatedTopLeftItems = [typeLabel, ...(topLeftItems ?? [])].filter(
      (item): item is AddonItem | JSX.Element => !!item,
    )

    const updatedTopRightItems = [...(topRightItems ?? [])].filter(
      (item): item is AddonItem /*  | JSX.Element */ => !!item,
    )

    const header = (
      <div className={`resource-card-header ${orientation} ${size}`} key="resource-card-header">
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

    const ownerNameRef = useRef<HTMLElement>(null)
    const [showOwnerNameAbbr, setShowOwnerNameAbbr] = useState(false)
    useEffect(() => {
      ownerNameRef.current instanceof HTMLElement &&
        setShowOwnerNameAbbr(isEllipsisActive(ownerNameRef.current))
    }, [ownerNameRef])

    const avatarLabel = (
      <Link href={owner.profileHref} key="avatar-label">
        <div style={avatar} className="avatar" />
        <abbr ref={ownerNameRef} {...(showOwnerNameAbbr && { title: owner.displayName })}>
          {owner.displayName}
        </abbr>
      </Link>
    )

    const pulishButton = canPublish && (
      <TertiaryButton
        key="publish-button"
        onClick={isPublished ? unpublish : publish}
        className={`publish-button ${isPublished ? 'published' : 'unpublished'}`}
        abbr={isPublished ? 'Unpublish' : 'Publish'}
      >
        <Public />
      </TertiaryButton>
    )

    const updatedBottomLeftItems = [avatarLabel, ...(bottomLeftItems ?? [])].filter(
      (item): item is AddonItem | JSX.Element => !!item,
    )

    const updatedBottomRightItems = [pulishButton, ...(bottomRightItems ?? [])].filter(
      (item): item is AddonItem | JSX.Element => !!item,
    )

    const footer = (
      <div className={`resource-card-footer ${orientation} ${size}`} key="footer">
        <div className={`footer-left  ${orientation}`}>
          {updatedBottomLeftItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
        <div className={`footer-right  ${orientation}`}>
          {updatedBottomRightItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
      </div>
    )

    const contentContainer = resourceHomeHref /* && !selectionMode */ ? (
      <Link
        className="content-container"
        href={resourceHomeHref}
        role="navigation"
        key="content-container"
      >
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
        className={`resource-card ${className} ${
          '' /* isSelected ? 'selected' : '' */
        } ${orientation} `}
        hover={true}
        style={orientation === 'vertical' ? background : {}}
      >
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    )
  },
  'ResourceCard',
)

export default ResourceCard
