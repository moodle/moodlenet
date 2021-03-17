import { EdgeType, Id, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { getRelCount } from '../../helpers/nodeMeta'
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
          followers: getRelCount(data?.node?._meta, EdgeType.Follows, 'from', NodeType.Profile),
          likers: getRelCount(data?.node?._meta, EdgeType.Likes, 'from', NodeType.Profile),
        }
      : null
  }
