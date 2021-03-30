import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import { MoodleNetExecutionContext } from '../../../../../types'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { ShallowNodeByType } from '../../../types.node'
import { Persistence } from '../types'
import { getNodeOpAqlAssertions } from './assertions/node'

export const getNode = async <Type extends GQL.NodeType = GQL.NodeType>({
  persistence: { db },
  nodeType,
  ctx,
  _key,
}: {
  persistence: Persistence
  ctx: MoodleNetExecutionContext
  _key: IdKey
  nodeType: Type
}) => {
  // console.log({ getNode: { ctx } })
  const aqlAssertionMaps = getNodeOpAqlAssertions({ ctx, op: 'read', nodeType, nodeVar: 'node' })
  if (typeof aqlAssertionMaps === 'string') {
    return null
  }

  const q = `
    let node = Document(${aqlstr(`${nodeType}/${_key}`)})

    FILTER ( ${aqlAssertionMaps.renderedAqlFilterExpr} )

    return node
  `
  // console.log(q)
  const cursor = await db.query(q)
  const node = await cursor.next()
  cursor.kill()
  return (node as ShallowNodeByType<Type>) || null
}
