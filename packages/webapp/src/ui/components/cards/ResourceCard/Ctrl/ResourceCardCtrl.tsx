import { isJust } from '@moodlenet/common/lib/utils/array'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { getMaybeAssetRefUrl } from '../../../../../helpers/data'
import { createWithProps } from '../../../../lib/ctrl'
import { ResourceCardProps } from '../ResourceCard'
import { useResourceCardQuery } from './ResourceCard.gen'

export type ResourceCardCtrlProps = { id: Id }
export const [ResourceCardCtrl, resourceCardWithProps, resourceCardWithPropList] = createWithProps<
  ResourceCardProps,
  ResourceCardCtrlProps
>(({ id, __key, __uiComp: ResourceCardUI, ...rest }) => {
  const resourceNode = useResourceCardQuery({ variables: { id } }).data?.node

  const resourceCardUIProps = useMemo<ResourceCardProps | null>(
    () =>
      resourceNode
        ? {
            type: 'Web Page',
            image: getMaybeAssetRefUrl(resourceNode.icon) ?? '',
            title: resourceNode.name,
            tags: resourceNode.inCollections.edges
              .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
              .filter(isJust)
              .map(node => node.name),
            ...rest,
          }
        : null,
    [resourceNode, rest],
  )
  return resourceCardUIProps && <ResourceCardUI {...resourceCardUIProps} />
})
