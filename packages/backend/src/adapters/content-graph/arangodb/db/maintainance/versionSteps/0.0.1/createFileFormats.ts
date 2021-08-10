import { getFileFormats } from '@moodlenet/common/lib/content-graph/initialData/file-format/fileFormats'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../functions/createNode'

export const createFileFormats = async ({ db }: { db: Database }) => {
  const fileFormats = getFileFormats()
  await Promise.all(
    fileFormats.map(async fileFormats_data => {
      console.log(`creating FileFormats ${fileFormats_data.name} ${fileFormats_data.code}`)
      await justExecute(createNodeQ({ node: fileFormats_data }), db)
    }),
  )
}
