import { GraphNodeByType, GraphNodeType, NodeStatus } from '@moodlenet/common/lib/content-graph/types/node'
import { omit } from '@moodlenet/common/lib/utils/object'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'

export const createNodeQ = <Type extends GraphNodeType>({
  node,
  status,
}: {
  node: DistOmit<GraphNodeByType<Type>, '_bumpStatus'>
  status: NodeStatus
}) => {
  const nodeType = node._type
  const aqlNodeButBump = { ...omit(node, ['_permId']), _key: node._permId }

  const q = aq<AqlGraphNodeByType<Type>>(`
    let newnode = MERGE(
      ${aqlstr(aqlNodeButBump)},
      {
        _bumpStatus:{
          status: ${aqlstr(status)},
          date: DATE_NOW()
        }
      }
    )

    INSERT newnode into ${nodeType}

    return NEW
  `)
  // console.log(q)
  return q
}
