import { Database } from 'arangojs'
import { getLicenses } from 'my-moodlenet-common/lib/content-graph/initialData/licenses/licenses'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const createLicenses = async ({ db }: { db: Database }) => {
  const licenses = getLicenses()
  await Promise.all(
    licenses.map(async license_data => {
      console.log(`creating License ${license_data.name} ${license_data.code}`)
      await justExecute(createNodeQ({ node: license_data }), db)
    }),
  )
}
