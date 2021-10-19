import { selectedIscedFields as selectedIscedFieldsCodes } from '@moodlenet/common/lib/content-graph/initialData/ISCED/Fields/IscedFields'
import { getIscedGrades } from '@moodlenet/common/lib/content-graph/initialData/ISCED/Grades/IscedGrades'
import { nodeTypes } from '@moodlenet/common/lib/content-graph/types/node'
import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { aqlstr, justExecute } from '../../../../../../../lib/helpers/arango/query'

export const setProperPublishedToAllEntities = async ({ db }: { db: Database }) => {
  console.log(`set Proper Published To All Entities`)
  const selectedIscedGradesCodes = getIscedGrades()
    .filter(_ => _.codePath.length === 1)
    .map(_ => _.code)
  return Promise.all(
    nodeTypes.map(nodeType => {
      const langType: NodeType = 'Language'
      const selectCodes =
        nodeType === 'IscedField'
          ? selectedIscedFieldsCodes
          : nodeType === 'IscedGrade'
          ? selectedIscedGradesCodes
          : null
      const q = `
let selectCodes = ${aqlstr(selectCodes)}
      
FOR n IN ${nodeType} 
  let up = { 
    _published: 
      n._type == ${aqlstr(langType)} 
      ? n.part1 != null
      : selectCodes != null 
        ? n.code in selectCodes 
        : true
  }

  UPDATE n WITH up in ${nodeType} 
  
  return null`

      // console.log(q, (db as any) === justExecute)
      return justExecute(q, db)
    }),
  )
}
