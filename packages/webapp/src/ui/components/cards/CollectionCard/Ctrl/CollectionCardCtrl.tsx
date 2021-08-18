import { narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { CollectionCardProps } from '../CollectionCard'
import { useCollectionCardQuery } from './CollectionCard.gen'

export type CollectionCardCtrlArg = { id: ID }
export const useCollectionCardCtrl: CtrlHook<CollectionCardProps, CollectionCardCtrlArg> = ({ id }) => {
  const collectionNode = narrowNodeType(['Collection'])(useCollectionCardQuery({ variables: { id } }).data?.node)
  const { org: localOrg } = useLocalInstance()
  const collectionCardUIProps = useMemo<CollectionCardProps | null>(
    () =>
      collectionNode
        ? {
            organization: localOrg.name,
            title: collectionNode.name,
            imageUrl: getMaybeAssetRefUrlOrDefaultImage(collectionNode.image, id, 'image'),
            collectionHref: href(nodeGqlId2UrlPath(id)),
            bookmarked,
            following,
            isAuthenticated,
            numFollowers,
            toggleBookmark,
            toggleFollow,
          }
        : null,
    [collectionNode, id, localOrg.name],
  )

  return collectionCardUIProps && [collectionCardUIProps]
}
