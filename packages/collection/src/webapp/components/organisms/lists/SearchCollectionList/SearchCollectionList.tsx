import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import { FC, useMemo } from 'react'
import { CollectionCard, CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import './SearchCollectionList.scss'

export type SearchCollectionListProps = {
  collectionCardPropsList: CollectionCardProps[]
}

export const SearchCollectionList: FC<SearchCollectionListProps> = ({
  collectionCardPropsList,
}) => {
  return (
    <ListCard
      className="search-collection-list"
      // className={`collections ${seeAll ? 'see-all' : ''}`}
      content={useMemo(
        () =>
          // seeAll
          // ? collectionCardPropsList :
          collectionCardPropsList
            .slice(0, 6)
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
          {/* {!seeAll && ( */}
          {/* )} */}
        </div>
      }
      footer={
        <TertiaryButton
        // onClick={() => activateSeeAll('Collections')}
        >
          See all collection results
        </TertiaryButton>
      }
      minGrid={240}
      maxRows={2}
    />
  )
}

SearchCollectionList.defaultProps = {}

export default SearchCollectionList
