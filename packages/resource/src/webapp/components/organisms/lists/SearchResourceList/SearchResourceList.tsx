import { ListCard, SecondaryButton } from '@moodlenet/component-library'
import { FC, useMemo } from 'react'
import ResourceCard, { ResourceCardProps } from '../../ResourceCard/ResourceCard.js'
import './SearchResourceList.scss'

export type SearchResourceListProps = {
  resourceCardPropsList: ResourceCardProps[]
}

export const SearchResourceList: FC<SearchResourceListProps> = ({ resourceCardPropsList }) => {
  return (
    <ListCard
      className="landing-resource-list"
      // className={`resources ${seeAll ? 'see-all' : ''}`}
      content={useMemo(
        () =>
          resourceCardPropsList
            // seeAll
            // ? resourceCardPropsList  :
            .slice(0, 6)
            .map(resourceCardProps => {
              return (
                <ResourceCard
                  key={resourceCardProps.data.resourceId}
                  {...resourceCardProps}
                  orientation="vertical"
                />
              )
            }),
        [resourceCardPropsList],
      )}
      title={
        <div className="card-header">
          <div className="title">Resources</div>
          {/* {!seeAll && ( */}
          <SecondaryButton
            // onClick={() => activateSeeAll('Resources')}
            color="dark-blue"
          >
            See all
          </SecondaryButton>
          {/* )} */}
        </div>
      }
      noCard={true}
      minGrid={245}
      maxHeight={736}
      // maxHeight={seeAll ? undefined : 736}
      // maxRows={seeAll ? undefined : 2}
    />
  )
}

SearchResourceList.defaultProps = {}

export default SearchResourceList
