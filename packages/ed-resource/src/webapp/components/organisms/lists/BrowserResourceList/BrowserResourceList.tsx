import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import type { BrowserMainColumnItemBase, ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ResourceCardPropsData } from '../../ResourceCard/ResourceCard.js'
import ResourceCard from '../../ResourceCard/ResourceCard.js'
import './BrowserResourceList.scss'

export type BrowserResourceListDataProps = {
  resourceCardPropsList: { props: ProxyProps<ResourceCardPropsData>; key: string }[]
  loadMore: (() => unknown) | null
}
export type BrowserResourceListProps = BrowserResourceListDataProps & BrowserMainColumnItemBase

export const BrowserResourceList: FC<BrowserResourceListProps> = ({
  resourceCardPropsList,
  showAll,
  setShowAll,
  loadMore,
  showHeader,
}) => {
  const listCard = (
    <ListCard
      className={`browser-resource-list ${showAll ? 'show-all' : ''} ${
        loadMore ? 'load-more' : ''
      }`}
      content={useMemo(
        () =>
          resourceCardPropsList.map(({ key, props }) => {
            return { key, el: <ResourceCard key={key} {...props} orientation="horizontal" /> }
          }),
        [resourceCardPropsList],
      )}
      header={
        showHeader && (
          <div className="card-header">
            <div className="title">Resources</div>
          </div>
        )
      }
      footer={
        showAll ? (
          loadMore ? (
            <TertiaryButton onClick={loadMore}>Load more</TertiaryButton>
          ) : null
        ) : (
          <TertiaryButton onClick={setShowAll}>See all resource results</TertiaryButton>
        )
      }
      minGrid={300}
      maxRows={showAll ? undefined : 3}
    />
  )

  return resourceCardPropsList.length > 0 ? listCard : null
}

BrowserResourceList.defaultProps = { showHeader: true }

export default BrowserResourceList
