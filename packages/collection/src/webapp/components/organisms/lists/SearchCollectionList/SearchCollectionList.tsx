import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import { FC, useMemo } from 'react'
import { CollectionCard, CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import './SearchCollectionList.scss'

export type SearchCollectionListProps = {
  collectionCardPropsList: CollectionCardProps[]
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const SearchCollectionList: FC<SearchCollectionListProps> = ({
  collectionCardPropsList,
  showAll,
  setShowAll,
}) => {
  return (
    <ListCard
      className={`search-collection-list ${showAll ? 'show-all' : ''}`}
      // className={`collections ${seeAll ? 'see-all' : ''}`}
      content={useMemo(
        () =>
          // seeAll
          // ? collectionCardPropsList :
          collectionCardPropsList
            // .slice(0, 6)
            .map(collectionCardProps => (
              <CollectionCard
                key={collectionCardProps.data.collectionId}
                {...collectionCardProps}
              />
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
      // minGrid={showAll ? undefined : 240}
      maxRows={showAll ? undefined : 2}
    />
  )
}

SearchCollectionList.defaultProps = {}

export default SearchCollectionList
