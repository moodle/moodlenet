import { getLicenses } from '@moodlenet/common/dist/content-graph/initialData/licenses/licenses'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createLicenses = async ({ db }: { db: Database }) => {
  const licenses = getLicenses()
  await Promise.all(
    licenses.map(async license_data => {
      console.log(`creating License ${license_data.name} ${license_data.code}`)
      await justExecute(addNodeQ({ node: license_data, assertions: {} }), db)
    }),
  )
}
