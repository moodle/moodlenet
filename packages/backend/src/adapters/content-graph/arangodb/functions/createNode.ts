import { GraphNodeByType, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { omit } from '@moodlenet/common/lib/utils/object'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'

export const createNodeQ = <Type extends GraphNodeType>({ node }: { node: GraphNodeByType<Type> }) => {
  const nodeType = node._type
  const aqlNodeButBump = { ...omit(node, ['_permId']), _key: node._permId }

  const q = aq<AqlGraphNodeByType<Type>>(`
    let newnode =${aqlstr(aqlNodeButBump)}

    INSERT newnode into ${nodeType}

    return NEW
  `)
  // console.log(q)
  return q
}
