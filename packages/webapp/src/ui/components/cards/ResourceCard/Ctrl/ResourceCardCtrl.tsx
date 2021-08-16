import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { nodeId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { getMaybeAssetRefUrl } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { ResourceCardProps } from '../ResourceCard'
import { useResourceCardQuery } from './ResourceCard.gen'

export type ResourceCardCtrlArg = { id: ID }
export const useResourceCardCtrl: CtrlHook<ResourceCardProps, ResourceCardCtrlArg> = ({ id }) => {
  const resourceNode = useResourceCardQuery({ variables: { id } }).data?.node

  const resourceCardUIProps = useMemo<ResourceCardProps | null>(
    () =>
      resourceNode && resourceNode.__typename === 'Resource'
        ? {
            type: resourceNode.kind === 'Link' ? 'Web Page' : resourceNode.content.mimetype,
            image: getMaybeAssetRefUrl(resourceNode.image) ?? '',
            title: resourceNode.name,
            tags: resourceNode.inCollections.edges
              .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
              .filter(isJust)
              .map(node => node.name),
            resourceHomeHref: href(nodeId2UrlPath(resourceNode.id)),
          }
        : null,
    [resourceNode],
  )
  return resourceCardUIProps && [resourceCardUIProps]
}
