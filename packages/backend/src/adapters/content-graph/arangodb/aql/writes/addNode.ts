import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { omit } from '@moodlenet/common/dist/utils/object'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Assertions } from '../../../../../ports/content-graph/graph-lang/base'
import { Operators, operators } from '../../../../../ports/content-graph/node/add'
import { AqlGraphNode } from '../../types'
import { aqlGraphNode2GraphNode, getAqlAssertions } from '../helpers'

export const addNodeQ = <Type extends GraphNodeType>({
  node,
  assertions,
}: {
  node: GraphNode<Type>
  assertions: Assertions
}) => {
  const nodeType = node._type
  const aqlAssertions = getAqlAssertions(assertions)
  //NOTE: TS forces me to include `_key` to omitted props, don't know why, but it's a local const no sideeffects
  const aqlNode: DistOmit<AqlGraphNode, '_key' | '_id' | '_rev'> = {
    _key: node._permId,
    ...omit(node, ['_permId']),
  }
  // console.log({ node, aqlNode })
  const q = aq<GraphNode<Type> | null>(`
    let addNode = ${aqlstr(aqlNode)}

    filter ${aqlAssertions}

    INSERT addNode into ${nodeType}

    return ${aqlGraphNode2GraphNode('NEW')}
  `)
  // console.log(q)
  return q
}

export const arangoAddNodeOperators: SockOf<typeof operators> = async () => ADD_NODE_OPERATORS
export const ADD_NODE_OPERATORS: Operators = {}
