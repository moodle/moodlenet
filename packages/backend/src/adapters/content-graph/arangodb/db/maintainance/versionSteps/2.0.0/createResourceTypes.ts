import { getResourceTypes } from '@moodlenet/common/dist/content-graph/initialData/resource-type/resource-type'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createResourceTypes = async ({ db }: { db: Database }) => {
  const resourceTypes = getResourceTypes()
  await Promise.all(
    resourceTypes.map(async resourceType_data => {
      console.log(`creating ResourceType ${resourceType_data.name}`)
      await justExecute(addNodeQ({ node: resourceType_data, assertions: {} }), db)
    }),
  )
}
