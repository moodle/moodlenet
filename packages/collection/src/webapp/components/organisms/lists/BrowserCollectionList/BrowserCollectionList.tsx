import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import { CollectionCard } from '../../CollectionCard/CollectionCard.js'
import './BrowserCollectionList.scss'

export type BrowserCollectionListProps = {
  collectionCardPropsList: CollectionCardProps[]
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const BrowserCollectionList: FC<BrowserCollectionListProps> = ({
  collectionCardPropsList,
  showAll,
  setShowAll,
}) => {
  return (
    <ListCard
      className={`browser-collection-list ${showAll ? 'show-all' : ''}`}
      content={useMemo(
        () =>
          collectionCardPropsList.map(collectionCardProps => (
            <CollectionCard key={collectionCardProps.data.collectionId} {...collectionCardProps} />
          )),
        [collectionCardPropsList],
      )}
      header={
        <div className="card-header">
          <div className="title">Collections</div>
        </div>
      }
      footer={
        !showAll && (
          <TertiaryButton onClick={() => setShowAll('collection-list')}>
            See all collection results
          </TertiaryButton>
        )
      }
      minGrid={showAll ? 300 : 240}
      maxRows={showAll ? undefined : 2}
    />
  )
}

BrowserCollectionList.defaultProps = {}

export default BrowserCollectionList
