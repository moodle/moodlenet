import { GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { omit } from '@moodlenet/common/lib/utils/object'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType, AqlGraphNodeDataByType } from '../types'

export const createNodeQ = <Type extends GraphNodeType>({
  data,
  nodeType,
}: {
  nodeType: Type
  data: AqlGraphNodeDataByType<Type> & { _permId: string }
}) => {
  const q = aq<AqlGraphNodeByType<typeof nodeType>>(`
    let newnode = ${aqlstr({ ...omit(data, ['_permId']), _key: data._permId })}

    INSERT newnode into ${nodeType}

    return NEW
  `)
  // console.log(q)
  return q
}
