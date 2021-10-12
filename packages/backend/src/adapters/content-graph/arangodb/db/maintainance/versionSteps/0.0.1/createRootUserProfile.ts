import { Database } from 'arangojs'
import { rootUserProfile } from 'my-moodlenet-common/lib/content-graph/initialData/content'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const createRootUserProfile = async ({ db }: { db: Database }) => {
  console.log(`creating rootUser profile`)
  await justExecute(
    createNodeQ({
      node: rootUserProfile,
    }),
    db,
  )
}
