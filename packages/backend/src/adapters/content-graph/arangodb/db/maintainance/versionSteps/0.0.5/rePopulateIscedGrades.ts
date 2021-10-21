import { getIscedGrades } from '@moodlenet/common/lib/content-graph/initialData/ISCED/Grades/IscedGrades'
import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const rePopulateIscedGrades = async ({ db }: { db: Database }) => {
  console.log(`re-populate IscedGrades`)
  const iscedGrades = getIscedGrades()
  const iscedGradeColl: NodeType = 'IscedGrade'
  await db.collection(iscedGradeColl).truncate()
  return Promise.all(
    iscedGrades.map(async iscedGrade_data => {
      console.log(`creating IscedGrade ${iscedGrade_data.name}  ${iscedGrade_data.code}`)
      await justExecute(createNodeQ({ node: iscedGrade_data, creatorAuthId: null }), db)
    }),
  )
}
