import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import { FC, useMemo } from 'react'
import ResourceCard, { ResourceCardProps } from '../../ResourceCard/ResourceCard.js'
import './SearchResourceList.scss'

export type SearchResourceListProps = {
  resourceCardPropsList: ResourceCardProps[]
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const SearchResourceList: FC<SearchResourceListProps> = ({
  resourceCardPropsList,
  showAll,
  setShowAll,
}) => {
  const listCard = (
    <ListCard
      className={`search-resource-list ${showAll ? 'show-all' : ''}`}
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
        </div>
      }
      footer={
        showAll ? null : (
          <TertiaryButton onClick={() => setShowAll('resource-list')}>
            See all resource results
          </TertiaryButton>
        )
      }
      minGrid={showAll ? 400 : 300}
      // minGrid={showAll ? undefined : 300}
      maxRows={showAll ? undefined : 3}
    />
  )

  return listCard
}

SearchResourceList.defaultProps = {}

export default SearchResourceList
