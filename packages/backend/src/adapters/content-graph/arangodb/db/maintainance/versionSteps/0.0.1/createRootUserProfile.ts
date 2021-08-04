import { Database } from 'arangojs'
import { rootUserProfile } from '../../../../../../../initialData/content'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../functions/createNode'

export const createRootUserProfile = async ({ db }: { db: Database }) => {
  console.log(`creating rootUser profile`)
  await justExecute(
    createNodeQ({
      node: rootUserProfile,
    }),
    db,
  )
}
