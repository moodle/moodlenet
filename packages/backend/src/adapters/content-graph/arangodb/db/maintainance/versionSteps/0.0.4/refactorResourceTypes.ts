import { getResourceTypes } from '@moodlenet/common/lib/content-graph/initialData/resource-type/resource-type'
import { resTypeMap } from '@moodlenet/common/lib/content-graph/initialData/resource-type/resTypeMap'
import { EdgeType, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { aqlstr, justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const refactorResourceTypes = async ({ db }: { db: Database }) => {
  console.log(`refactor ResourceTypes`)
  const resourceTypes = getResourceTypes()
  const resourceTypeColl: NodeType = 'ResourceType'
  await db.collection(resourceTypeColl).truncate()
  await Promise.all(
    resourceTypes.map(async resourceType_data => {
      console.log(`creating ResourceType ${resourceType_data.name}`)
      await justExecute(createNodeQ({ node: resourceType_data, creatorAuthId: null }), db)
    }),
  )
  const featuresColl: EdgeType = 'Features'

  const resTypeMap_id = Object.entries(resTypeMap).reduce(
    (map, [key, val]) => ({ ...map, [`${resourceTypeColl}/${key}`]: `${resourceTypeColl}/${val}` }),
    {},
  )
  const q = `let resTypeMap = ${aqlstr(resTypeMap_id)}
FOR feats IN ${featuresColl}
  FILTER feats._toType == ${aqlstr(resourceTypeColl)}
  UPDATE feats WITH { _to : resTypeMap[feats._to] } IN ${featuresColl}
  RETURN NEW`

  await justExecute(q, db)
}
