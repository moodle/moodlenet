import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { omit } from '@moodlenet/common/lib/utils/object'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNode, AqlGraphNodeByType } from '../types'

export const createNodeQ = <Type extends GraphNodeType>({ node }: { node: GraphNode<Type> }) => {
  const nodeType = node._type

  //NOTE: TS forces me to include `_key` to omitted props, don't know why, but it's a local const no sideeffects
  const aqlNode: DistOmit<AqlGraphNode, '_key' | '_id' | '_rev'> = {
    _key: node._permId,
    ...omit(node, ['_permId']),
  }

  const q = aq<AqlGraphNodeByType<Type>>(`
    let newnode = ${aqlstr(aqlNode)}

    INSERT ${aqlstr(aqlNode)} into ${nodeType}

    return NEW
  `)
  // console.log(q)
  return q
}
