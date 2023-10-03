import type { Href } from '@moodlenet/component-library'
import { ListCard } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import { CollectionCard } from '../../CollectionCard/CollectionCard.js'
import './LandingCollectionList.scss'

export type LandingCollectionListProps = {
  searchCollectionsHref: Href
  collectionCardPropsList: { props: ProxyProps<CollectionCardProps>; key: string }[]
  hasSetInterests: boolean
}

export const LandingCollectionList: FC<LandingCollectionListProps> = ({
  collectionCardPropsList,
  // searchCollectionsHref,
  hasSetInterests,
}) => {
  const title = (
    <div className="title">
      {hasSetInterests ? 'Collections selection' : 'Featured collections'}
    </div>
  )

  const subtitle = (
    <div className="subtitle">
      {hasSetInterests
        ? 'High quality collections you might enjoy'
        : 'Great collections of curated resources'}
    </div>
  )
  return (
    <ListCard
      className="landing-collection-list"
      content={useMemo(
        () =>
          collectionCardPropsList
            .slice(0, 20)
            .map(({ key, props }) => ({ key, el: <CollectionCard key={key} {...props} /> })),
        [collectionCardPropsList],
      )}
      header={
        <div className="card-header">
          <div className="info">
            {title}
            {subtitle}
          </div>
        </div>
      }
      minGrid={245}
      noCard={true}
      maxRows={3}
    />
  )
}

LandingCollectionList.defaultProps = {}

export default LandingCollectionList
