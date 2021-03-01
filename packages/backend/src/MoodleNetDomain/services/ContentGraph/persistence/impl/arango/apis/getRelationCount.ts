import { nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
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

  const queryDepth = [1, 1]
  const depth = queryDepth.join('..')

  const sourceNodeType = nodeTypeFromId(nodeId)
  const fromNodeType = inverse ? targetNodeType : sourceNodeType
  const toNodeType = inverse ? sourceNodeType : targetNodeType

  const direction = inverse ? 'INBOUND' : 'OUTBOUND'

  const q = `FOR parentNode, edge 
      IN ${depth} ${direction} ${aqlstr(nodeId)} ${edgeType}

      FILTER edge.from == '${fromNodeType}' 
          && edge.to   == '${toNodeType}'
      
      COLLECT WITH COUNT INTO count
      
      RETURN  count
    `
  console.log(q)
  const cursor = await db.query(q)
  const count = (await cursor.all())[0] as number
  return count
}
