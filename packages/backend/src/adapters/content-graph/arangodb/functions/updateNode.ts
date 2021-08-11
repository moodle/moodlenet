import { GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { EditNodeData } from '../../../../ports/content-graph/node'
import { AqlGraphNodeByType } from '../types'
import { getAqlNodeByGraphNodeIdentifier } from './helpers'

export const updateNodeQ = <Type extends GraphNodeType>({
  nodeData,
  nodeId,
}: {
  nodeData: EditNodeData<Type>
  nodeId: GraphNodeIdentifier<Type>
}) => {
  const nodeType = nodeId._type

  const q = aq<AqlGraphNodeByType<Type>>(`
    let node = ${getAqlNodeByGraphNodeIdentifier(nodeId)}
    UPDATE node WITH ${aqlstr(nodeData)} into ${nodeType}

    return NEW
  `)
  console.log(q)
  return q
}
