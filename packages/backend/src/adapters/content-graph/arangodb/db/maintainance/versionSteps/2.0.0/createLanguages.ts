import { getIso639_3 } from '@moodlenet/common/dist/content-graph/initialData/ISO_639_3/ISO_639_3'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createLanguges = async ({ db }: { db: Database }) => {
  const languges = getIso639_3()
  await Promise.all(
    languges.map(async languge_data => {
      console.log(`creating Languge ${languge_data.name}`)
      await justExecute(addNodeQ({ node: languge_data, assertions: {} }), db)
    }),
  )
}
