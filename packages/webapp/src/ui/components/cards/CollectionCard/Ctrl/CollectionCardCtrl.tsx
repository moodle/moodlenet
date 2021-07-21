import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { getMaybeAssetRefUrl } from '../../../../../helpers/data'
import { CtrlHook } from '../../../../lib/ctrl'
import { CollectionCardProps } from '../CollectionCard'
import { useCollectionCardQuery } from './CollectionCard.gen'

export type CollectionCardCtrlArg = { id: Id }
export const useCollectionCardCtrl: CtrlHook<CollectionCardProps, CollectionCardCtrlArg> = ({ id }) => {
  const collectionNode = useCollectionCardQuery({ variables: { id } }).data?.node
  const { org: localOrg } = useLocalInstance()
  const collectionCardUIProps = useMemo<CollectionCardProps | null>(
    () =>
      collectionNode
        ? {
            organization: collectionNode._organization?.name ?? localOrg.name,
            title: collectionNode.name,
            imageUrl: getMaybeAssetRefUrl(collectionNode.icon) ?? '',
          }
        : null,
    [collectionNode, localOrg],
  )

  return collectionCardUIProps && [collectionCardUIProps]
}
