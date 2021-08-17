import { isEdgeNodeOfType, maybeNodeOfType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { ResourceCardProps } from '../ResourceCard'
import { useResourceCardQuery } from './ResourceCard.gen'

export type ResourceCardCtrlArg = { id: ID }
export const useResourceCardCtrl: CtrlHook<ResourceCardProps, ResourceCardCtrlArg> = ({ id }) => {
  const resourceNode = maybeNodeOfType(['Resource'])(useResourceCardQuery({ variables: { id } }).data?.node)

  const resourceCardUIProps = useMemo<ResourceCardProps | null>(
    () =>
      resourceNode
        ? {
            type: resourceNode.kind === 'Link' ? 'Web Page' : resourceNode.content.mimetype,
            image: getMaybeAssetRefUrlOrDefaultImage(resourceNode.image, id, 'image') ?? '',
            title: resourceNode.name,
            tags: resourceNode.inCollections.edges.filter(isEdgeNodeOfType(['Collection'])).map(edge => edge.node.name),
            resourceHomeHref: href(nodeGqlId2UrlPath(resourceNode.id)),
          }
        : null,
    [resourceNode, id],
  )
  return resourceCardUIProps && [resourceCardUIProps]
}
