import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { getMaybeAssetRefUrl } from '../../../../../helpers/data'
import { CtrlHook } from '../../../../lib/ctrl'
import { CollectionCardProps } from '../CollectionCard'
import { useCollectionCardQuery } from './CollectionCard.gen'

export type CollectionCardCtrlArg = { id: ID }
export const useCollectionCardCtrl: CtrlHook<CollectionCardProps, CollectionCardCtrlArg> = ({ id }) => {
  const collectionNode = useCollectionCardQuery({ variables: { id } }).data?.node
  const { org: localOrg } = useLocalInstance()
  const collectionCardUIProps = useMemo<CollectionCardProps | null>(
    () =>
      collectionNode && collectionNode.__typename === 'Collection'
        ? {
            organization: null ?? localOrg.name,
            title: collectionNode.name,
            imageUrl: getMaybeAssetRefUrl(collectionNode.image) ?? '',
          }
        : null,
    [collectionNode, localOrg],
  )

  return collectionCardUIProps && [collectionCardUIProps]
}
