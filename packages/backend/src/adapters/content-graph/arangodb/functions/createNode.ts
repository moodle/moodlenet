import { GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType, AqlGraphNodeDataByType } from '../types'

export const createNodeQ = <Type extends GraphNodeType>({
  data,
  nodeType,
}: {
  nodeType: Type
  data: AqlGraphNodeDataByType<Type>
}) => {
  const q = aq<AqlGraphNodeByType<typeof nodeType>>(`
    let newnode = ${aqlstr(data)}

    INSERT newnode into ${nodeType}

    return NEW
  `)
  // console.log(q)
  return q
}
