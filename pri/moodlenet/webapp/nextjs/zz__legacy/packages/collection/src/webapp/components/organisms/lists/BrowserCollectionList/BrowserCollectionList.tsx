import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import type { BrowserMainColumnItemBase, ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { CollectionCardProps } from '../../CollectionCard/CollectionCard'
import { CollectionCard } from '../../CollectionCard/CollectionCard'
import './BrowserCollectionList.scss'

export type BrowserCollectionListDataProps = {
  collectionCardPropsList: { props: ProxyProps<CollectionCardProps>; key: string }[]
  loadMore: (() => unknown) | null
}
export type BrowserCollectionListProps = BrowserCollectionListDataProps & BrowserMainColumnItemBase

export const BrowserCollectionList: FC<BrowserCollectionListProps> = ({
  collectionCardPropsList,
  showAll,
  setShowAll,
  loadMore,
  showHeader,
}) => {
  const listCard = (
    <ListCard
      className={`browser-collection-list ${showAll ? 'show-all' : ''} ${
        loadMore ? 'load-more' : ''
      }`}
      content={useMemo(
        () =>
          collectionCardPropsList.map(({ key, props }) => ({
            key,
            el: <CollectionCard key={key} {...props} />,
          })),
        [collectionCardPropsList],
      )}
      header={
        showHeader && (
          <div className="card-header">
            <div className="title">Collections</div>
          </div>
        )
      }
      footer={
        showAll ? (
          loadMore ? (
            <TertiaryButton onClick={loadMore}>Load more</TertiaryButton>
          ) : null
        ) : (
          <TertiaryButton onClick={setShowAll}>See all collection results</TertiaryButton>
        )
      }
      minGrid={showAll ? 300 : 240}
      maxRows={showAll ? undefined : 2}
    />
  )

  return collectionCardPropsList.length > 0 ? listCard : null
}

BrowserCollectionList.defaultProps = { showHeader: true }

export default BrowserCollectionList
