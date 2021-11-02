import { getIscedFields } from '@moodlenet/common/dist/content-graph/initialData/ISCED/Fields/IscedFields'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createIscedFields = async ({ db }: { db: Database }) => {
  const iscedFields = getIscedFields()
  await Promise.all(
    iscedFields.map(async iscedField_data => {
      console.log(`creating IscedField ${iscedField_data.name} ${iscedField_data.code}`)
      await justExecute(addNodeQ({ node: iscedField_data, assertions: {} }), db)
    }),
  )
}
