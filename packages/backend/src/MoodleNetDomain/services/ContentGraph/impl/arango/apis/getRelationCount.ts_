import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const getRelationCount: ContentGraphPersistence['getRelationCount'] = async ({
  edgeType,
  inverse,
  nodeId,
  targetNodeType,
}): Promise<number> => {
  const { db } = await DBReady()

  const filterOnSideType = inverse ? 'from' : 'to'
  const direction = inverse ? 'INBOUND' : 'OUTBOUND'

  const q = `FOR parentNode, edge 
      IN 1..1 ${direction} ${aqlstr(nodeId)} ${edgeType}
      FILTER edge.${filterOnSideType} == '${targetNodeType}' 
      COLLECT WITH COUNT INTO count
      RETURN count
    `
  console.log(q)
  const cursor = await db.query(q)
  const count = (await cursor.all())[0] as number
  return count
}
