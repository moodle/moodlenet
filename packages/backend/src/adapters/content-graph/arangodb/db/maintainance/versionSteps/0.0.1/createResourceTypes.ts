import { Database } from 'arangojs'
import { getResourceTypes } from '../../../../../../../initialData/resource-type/resource-type'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../functions/createNode'

export const createResourceTypes = async ({ db }: { db: Database }) => {
  const resourceTypes = getResourceTypes()
  await Promise.all(
    resourceTypes.map(async resourceType_data => {
      console.log(`creating ResourceType ${resourceType_data.name}`)
      await justExecute(createNodeQ({ node: resourceType_data }), db)
    }),
  )
}
