import { Database } from 'arangojs'
import { getIso639_3 } from 'my-moodlenet-common/lib/content-graph/initialData/ISO_639_3/ISO_639_3'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const createLanguges = async ({ db }: { db: Database }) => {
  const languges = getIso639_3()
  await Promise.all(
    languges.map(async languge_data => {
      console.log(`creating Languge ${languge_data.name}`)
      await justExecute(createNodeQ({ node: languge_data }), db)
    }),
  )
}
