import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ResourceCardPropsData } from '../../ResourceCard/ResourceCard.js'
import ResourceCard from '../../ResourceCard/ResourceCard.js'
import './BrowserResourceList.scss'

export type BrowserResourceListProps = {
  resourceCardPropsList: ResourceCardPropsData[]
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
  loadMore: (() => unknown) | null
}

export const BrowserResourceList: FC<BrowserResourceListProps> = ({
  resourceCardPropsList,
  showAll,
  setShowAll,
  loadMore,
}) => {
  const listCard = (
    <ListCard
      className={`browser-resource-list ${showAll ? 'show-all' : ''} ${
        loadMore ? 'load-more' : ''
      }`}
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
        showAll ? (
          loadMore ? (
            <TertiaryButton onClick={loadMore}>Load more</TertiaryButton>
          ) : null
        ) : (
          <TertiaryButton onClick={() => setShowAll('resource-list')}>
            See all resource results
          </TertiaryButton>
        )
      }
      minGrid={showAll ? 400 : 300}
      maxRows={showAll ? undefined : 3}
    />
  )

  return listCard
}

BrowserResourceList.defaultProps = {}

export default BrowserResourceList
