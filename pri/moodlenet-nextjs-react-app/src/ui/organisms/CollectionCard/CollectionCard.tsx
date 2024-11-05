import { Bookmark, BookmarkBorder, FilterNone, PermIdentity, Person, Public, PublicOff } from '@mui/icons-material'
import { useEffect, useRef, useState } from 'react'

import { selection } from '@moodle/lib-types'
import { collectionCardData } from '@moodle/module/moodlenet-react-app'
import Link from 'next/link'
import { useAssetUrl } from '../../../lib/client/globalContexts'
import { appRoute } from '../../../lib/common/appRoutes'
import { Card } from '../../atoms/Card/Card'
import { TertiaryButton } from '../../atoms/TertiaryButton/TertiaryButton'
import { getBackupImage, isEllipsisActive } from '../../lib/misc'
import './CollectionCard.scss'

type collectionCardActions = {
  toggleBookmark(): Promise<void>
  toggleFollow(): Promise<void>
}

export type collectionCardProps = collectionCardData & {
  collectionPageRoute: appRoute
  actions: selection<collectionCardActions, never, 'toggleBookmark' | 'toggleFollow'>
}
export function CollectionCard(props: collectionCardProps) {
  const [imageUrl /* , imageCredits */] = useAssetUrl(props.data.image, getBackupImage(props.id))
  const background = {
    background: 'url(' + imageUrl + ')',
    backgroundSize: 'cover',
  }
  const titleRef = useRef<HTMLElement>(null)
  const [showTitleAbbr, setShowTitleAbbr] = useState(false)
  useEffect(() => {
    titleRef.current instanceof HTMLElement && setShowTitleAbbr(isEllipsisActive(titleRef.current))
  }, [titleRef])
  const isPublished = props.status === 'published'
  return (
    <Card className={`collection-card ${isPublished ? 'published' : 'unpublished'}`} hover={true}>
      <div className={`collection-card-background ${isPublished ? 'published' : 'unpublished'}`} style={background}>
        <div className="overlay" />
      </div>
      <div className={`collection-card-header`} key="header">
        <div className="header-left">
          {isPublished && (
            <TertiaryButton
              className="num-resources"
              key="num-resources"
              abbr={`Contains ${props.stats.numResources} resource${props.stats.numResources === 1 ? '' : 's'}`}
              disabled
            >
              <FilterNone />
              {props.stats.numResources}
            </TertiaryButton>
          )}
        </div>
        <div className="header-right">
          {isPublished && (
            <>
              <TertiaryButton
                key="bookmark-button"
                className={`bookmark-button ${props.links.bookmarked ? 'bookmarked' : ''}`}
                onClick={props.actions.toggleBookmark ? props.actions.toggleBookmark : e => e.stopPropagation()}
                abbr="Bookmark"
              >
                {props.links.bookmarked ? <Bookmark /> : <BookmarkBorder />}
              </TertiaryButton>
              <TertiaryButton
                key="follow-button"
                className={`follow-button ${props.links.followed ? 'followed' : ''} ${!props.actions.toggleFollow ? 'disabled' : ''}`}
                abbr={
                  props.flags.isCreator
                    ? 'Creators cannot follow their own content'
                    : !props.flags.isAuthenticated
                      ? 'Login or signup to follow the collection'
                      : props.links.followed
                        ? 'Unfollow'
                        : 'Follow'
                }
                onClick={props.actions.toggleFollow ? props.actions.toggleFollow : e => e.stopPropagation()}
              >
                {props.links.followed ? <Person /> : <PermIdentity />}
                <span>{props.stats.numFollowers}</span>
              </TertiaryButton>
            </>
          )}

          {isPublished ? (
            <abbr title="Published" key="publish-stat" style={{ cursor: 'initial' }} className="publish-state">
              <Public style={{ fill: '#00bd7e' }} />
            </abbr>
          ) : (
            <abbr title="Unpublished" key="publish-stat" style={{ cursor: 'initial' }} className="publish-state">
              <PublicOff />
            </abbr>
          )}
        </div>
      </div>
      <Link href={props.collectionPageRoute} className="collection-card-content" key="content-containr">
        <abbr className="title" title={showTitleAbbr ? props.data.title : undefined} ref={titleRef}>
          {props.data.title}
        </abbr>
      </Link>
    </Card>
  )
}
