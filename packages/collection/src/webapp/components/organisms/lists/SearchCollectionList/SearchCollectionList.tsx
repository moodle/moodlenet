import { ListCard, SecondaryButton } from '@moodlenet/component-library'
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
      className="landing-collection-card-list"
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
      title={
        <div className="card-header">
          <div className="title">Collections</div>
          {/* {!seeAll && ( */}
          <SecondaryButton
            // onClick={() => activateSeeAll('Collections')}
            color="dark-blue"
          >
            See all
          </SecondaryButton>
          {/* )} */}
        </div>
      }
      noCard={true}
      minGrid={240}
      maxHeight={397}
      // maxHeight={seeAll ? undefined : 397}
      // maxRows={seeAll ? undefined : 2}
      // maxRows={2}
    />
  )
}

SearchCollectionList.defaultProps = {}

export default SearchCollectionList
