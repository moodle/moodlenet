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
}

export const BrowserResourceList: FC<BrowserResourceListProps> = ({
  resourceCardPropsList,
  showAll,
  setShowAll,
}) => {
  const listCard = (
    <ListCard
      className={`browser-resource-list ${showAll ? 'show-all' : ''}`}
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

BrowserResourceList.defaultProps = {}

export default BrowserResourceList
