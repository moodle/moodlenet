import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { UseBaseContentNodePanelProps } from '../../ui/components/BaseContentNodePanel'
import { contentNodeLink } from '../../ui/lib'
import { useBaseContentNodeQuery } from './BaseContentNode/baseContentNode.gen'

export const getUseBaseContentNodePanelProps = ({ id }: { id: Id }): UseBaseContentNodePanelProps =>
  function useBaseContentNodePanelProps() {
    const { data } = useBaseContentNodeQuery({ variables: { id } })
    const node = data?.node
    return node
      ? {
          icon: node.icon ?? null,
          link: contentNodeLink(node),
          name: node.name,
          summary: node.summary,
          type: node.__typename,
        }
      : null
  }
