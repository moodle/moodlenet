import { getIscedFields } from '@moodlenet/common/lib/content-graph/initialData/ISCED/Fields/IscedFields'
import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const rePopulateIscedFields = async ({ db }: { db: Database }) => {
  console.log(`re-populate IscedFields`)
  const iscedFields = getIscedFields()
  const iscedFieldColl: NodeType = 'IscedField'
  await db.collection(iscedFieldColl).truncate()
  return Promise.all(
    iscedFields.map(async iscedField_data => {
      console.log(`creating IscedField ${iscedField_data.name} ${iscedField_data.code}`)
      await justExecute(createNodeQ({ node: iscedField_data, creatorNode: null }), db)
    }),
  )
}
