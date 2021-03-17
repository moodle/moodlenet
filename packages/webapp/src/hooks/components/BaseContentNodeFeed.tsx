import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { UseBaseContentNodeFeedProps } from '../../ui/components/BaseContentNodeFeed'
import { useBaseContentNodeQuery } from './BaseContentNode/baseContentNode.gen'

export const getUseBaseContentNodeFeedProps = ({ id }: { id: Id }): UseBaseContentNodeFeedProps =>
  function useBaseContentNodeFeedProps() {
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
