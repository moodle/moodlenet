import { getResourceTypes } from '@moodlenet/common/lib/content-graph/initialData/resource-type/resource-type'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const createResourceTypes = async ({ db }: { db: Database }) => {
  const resourceTypes = getResourceTypes()
  await Promise.all(
    resourceTypes.map(async resourceType_data => {
      console.log(`creating ResourceType ${resourceType_data.name}`)
      await justExecute(createNodeQ({ node: resourceType_data }), db)
    }),
  )
}
