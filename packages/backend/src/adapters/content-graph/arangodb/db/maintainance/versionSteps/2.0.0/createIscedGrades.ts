import { getIscedGrades } from '@moodlenet/common/dist/content-graph/initialData/ISCED/Grades/IscedGrades'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'
import { addNodeQ } from '../../../../aql/writes/addNode'

export const createIscedGrades = async ({ db }: { db: Database }) => {
  const iscedGrades = getIscedGrades()
  await Promise.all(
    iscedGrades.map(async iscedGrade_data => {
      console.log(`creating IscedGrade ${iscedGrade_data.name} ${iscedGrade_data.code}`)
      await justExecute(addNodeQ({ node: iscedGrade_data, assertions: {} }), db)
    }),
  )
}
