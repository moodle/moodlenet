import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { createWithProps } from '../../../../lib/ctrl'
import { CollectionCardProps } from '../CollectionCard'
import { useCollectionCardQuery } from './CollectionCard.gen'

export const [CollectionCardCtrl, collectionCardWithProps, collectionCardWithPropList] = createWithProps<
  CollectionCardProps,
  { id: Id }
>(({ id, __key, __uiComp: CollectionCardUI, ...rest }) => {
  const collectionNode = useCollectionCardQuery({ variables: { id } }).data?.node

  const collectionCardUIProps = useMemo<CollectionCardProps | null>(
    () =>
      collectionNode
        ? {
            organization: 'abc',
            title: collectionNode.name,
            imageUrl: collectionNode.icon?.location ?? '',
            ...rest,
          }
        : null,
    [collectionNode, rest],
  )
  return collectionCardUIProps && <CollectionCardUI {...collectionCardUIProps} />
})
