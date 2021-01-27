import { Node, NodeType } from '../../../../ContentGraph.graphql.gen'
import { ShallowNode } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createNode = async <Type extends NodeType>(_: {
  data: ShallowNode<Node & { __typename: Type }>
}) => {
  const { graph } = await DBReady
}
