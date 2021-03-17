import { DeepPartial } from '@moodlenet/common/lib/utils/types'
import { Maybe } from 'graphql/jsutils/Maybe'
import { EdgeType, NodeMeta, NodeType } from '../graphql/pub.graphql.link'

export const getRelCount = (
  _meta: Maybe<DeepPartial<NodeMeta>>,
  relType: EdgeType,
  dir: 'to' | 'from',
  targetNode: NodeType,
) => _meta?.relCount?.[relType]?.[dir]?.[targetNode] ?? 0
