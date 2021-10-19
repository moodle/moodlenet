import { EdgeType, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { aqlstr, justExecute } from '../../../../../../../lib/helpers/arango/query'

export const remapIscedGrades = async ({ db }: { db: Database }) => {
  console.log(`re-map IscedGrades`)
  const featuresColl: EdgeType = 'Features'
  const iscedGradeColl: NodeType = 'IscedGrade'
  const q = `
for e in ${featuresColl}
  filter e._toType == ${aqlstr(iscedGradeColl)} 
  let grade = document(e._to)
  filter length(grade.codePath) > 1
  let upd = {_to: CONCAT(${aqlstr(iscedGradeColl)} , '/ED', grade.codePath[0])}
  UPDATE e with upd in ${featuresColl}
  return null`
  return justExecute(q, db)
}
