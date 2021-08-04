import { GraphNodeByType, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { omit } from '@moodlenet/common/lib/utils/object'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'

export const createNodeQ = <Type extends GraphNodeType>({ node }: { node: GraphNodeByType<Type> }) => {
  const nodeType = node._type
  const aqlNode = {
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
