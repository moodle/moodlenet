import { Database } from 'arangojs'
import { getIscedFields } from 'my-moodlenet-common/lib/content-graph/initialData/ISCED/Fields/IscedFields'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const createIscedFields = async ({ db }: { db: Database }) => {
  const iscedFields = getIscedFields()
  await Promise.all(
    iscedFields.map(async iscedField_data => {
      console.log(`creating IscedField ${iscedField_data.name} ${iscedField_data.code}`)
      await justExecute(createNodeQ({ node: iscedField_data }), db)
    }),
  )
}
