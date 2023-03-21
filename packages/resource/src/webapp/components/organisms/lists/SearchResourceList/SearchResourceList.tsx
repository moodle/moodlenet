import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import { FC, useMemo } from 'react'
import ResourceCard, { ResourceCardProps } from '../../ResourceCard/ResourceCard.js'
import './SearchResourceList.scss'

export type SearchResourceListProps = {
  resourceCardPropsList: ResourceCardProps[]
}

export const SearchResourceList: FC<SearchResourceListProps> = ({ resourceCardPropsList }) => {
  const listCard = (
    <ListCard
      className="search-resource-list"
      content={useMemo(
        () =>
          resourceCardPropsList.map(resourceCardProps => {
            return (
              <ResourceCard
                key={resourceCardProps.data.resourceId}
                {...resourceCardProps}
                orientation="horizontal"
              />
            )
          }),
        [resourceCardPropsList],
      )}
      header={
        <div className="card-header">
          <div className="title">Resources</div>
          {/* {!seeAll && ( */}
          {/* )} */}
        </div>
      }
      footer={
        <TertiaryButton
        // onClick={() => activateSeeAll('Resources')}
        >
          See all resource results
        </TertiaryButton>
      }
      minGrid={300}
      maxRows={3}
    />
  )

  return listCard
}

SearchResourceList.defaultProps = {}

export default SearchResourceList
