import { DeepPartial } from '@moodlenet/common/src/utils/types'
import { EdgeType, Maybe, NodeMeta, NodeType } from '../graphql/pub.graphql.link'

export const getRelCount = (
  _meta: Maybe<DeepPartial<NodeMeta>>,
  relType: EdgeType,
  dir: 'to' | 'from',
  targetNode: NodeType,
) => _meta?.relCount?.[relType]?.[dir]?.[targetNode] ?? 0
