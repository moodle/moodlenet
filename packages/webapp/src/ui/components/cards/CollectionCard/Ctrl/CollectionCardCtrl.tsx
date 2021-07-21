import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { getMaybeAssetRefUrl } from '../../../../../helpers/data'
import { CtrlHook } from '../../../../lib/ctrl'
import { defaultOrganization } from '../../../../lib/static-data'
import { CollectionCardProps } from '../CollectionCard'
import { useCollectionCardQuery } from './CollectionCard.gen'

export type CollectionCardCtrlArg = { id: Id }
export const useCollectionCardCtrl: CtrlHook<CollectionCardProps, CollectionCardCtrlArg> = ({ id }) => {
  const collectionNode = useCollectionCardQuery({ variables: { id } }).data?.node

  const collectionCardUIProps = useMemo<CollectionCardProps | null>(
    () =>
      collectionNode
        ? {
            organization: defaultOrganization.name,
            title: collectionNode.name,
            imageUrl: getMaybeAssetRefUrl(collectionNode.icon) ?? '',
          }
        : null,
    [collectionNode],
  )

  return collectionCardUIProps && [collectionCardUIProps]
}
