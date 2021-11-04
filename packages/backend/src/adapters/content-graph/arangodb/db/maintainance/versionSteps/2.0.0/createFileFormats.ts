import { getFileFormats } from '@moodlenet/common/dist/content-graph/initialData/file-format/fileFormats'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createFileFormats = async ({ db }: { db: Database }) => {
  const fileFormats = getFileFormats()
  await Promise.all(
    fileFormats.map(async fileFormats_data => {
      console.log(`creating FileFormats ${fileFormats_data.name} ${fileFormats_data.code}`)
      await justExecute(addNodeQ({ node: fileFormats_data, assertions: {} }), db)
    }),
  )
}
