import { localOrganizationData, LocalOrgInitialData } from '@moodlenet/common/dist/content-graph/initialData/content'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createLocalOrg = async ({ db, org }: { db: Database; org: LocalOrgInitialData }) => {
  const node = localOrganizationData(org)
  console.log(`creating Local Organization ${org.name} @ ${org.domain}`)
  await justExecute(addNodeQ({ node, assertions: {} }), db)
}
