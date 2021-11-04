import { localOrganizationData } from '@moodlenet/common/dist/content-graph/initialData/content'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createLocalOrg = async ({ db, domain, name }: { db: Database; domain: string; name: string }) => {
  const node = localOrganizationData({ domain, name })
  console.log(`creating Local Organization ${name} @ ${domain}`)
  await justExecute(addNodeQ({ node, assertions: {} }), db)
}
