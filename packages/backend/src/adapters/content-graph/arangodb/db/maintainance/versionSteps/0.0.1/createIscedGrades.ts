import { getIscedGrades } from '@moodlenet/common/lib/content-graph/initialData/ISCED/Grades/IscedGrades'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { createNodeQ } from '../../../../aql/writes/createNode'

export const createIscedGrades = async ({ db }: { db: Database }) => {
  const iscedGrades = getIscedGrades()
  await Promise.all(
    iscedGrades.map(async iscedGrade_data => {
      console.log(`creating IscedGrade ${iscedGrade_data.name} ${iscedGrade_data.code}`)
      await justExecute(createNodeQ({ node: iscedGrade_data }), db)
    }),
  )
}
