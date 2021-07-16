import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { getMaybeAssetRefUrl } from '../../../../../helpers/data'
import { createWithProps } from '../../../../lib/ctrl'
import { CollectionCardProps } from '../CollectionCard'
import { useCollectionCardQuery } from './CollectionCard.gen'

export type CollectionCardCtrlProps = { id: Id }
export const [CollectionCardCtrl, collectionCardWithProps, collectionCardWithPropList] = createWithProps<
  CollectionCardProps,
  CollectionCardCtrlProps
>(({ id, __key, __uiComp: CollectionCardUI, ...rest }) => {
  const collectionNode = useCollectionCardQuery({ variables: { id } }).data?.node

  const collectionCardUIProps = useMemo<CollectionCardProps | null>(
    () =>
      collectionNode
        ? {
            organization: 'abc',
            title: collectionNode.name,
            imageUrl: getMaybeAssetRefUrl(collectionNode.icon) ?? '',
            ...rest,
          }
        : null,
    [collectionNode, rest],
  )
  return collectionCardUIProps && <CollectionCardUI {...collectionCardUIProps} />
})
