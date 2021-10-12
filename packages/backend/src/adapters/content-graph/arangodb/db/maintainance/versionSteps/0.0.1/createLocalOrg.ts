import { Database } from 'arangojs'
import { localOrganizationData } from 'my-moodlenet-common/lib/content-graph/initialData/content'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const createLocalOrg = async ({ db, domain }: { db: Database; domain: string }) => {
  console.log(`creating Local Organization ${localOrganizationData.name}`)
  await justExecute(
    createNodeQ({
      node: {
        ...localOrganizationData,
        domain,
      },
    }),
    db,
  )
}
