import { IscedGrade } from '@moodlenet/common/lib/content-graph/types/node'
import { getIscedGradePathByCode } from '@moodlenet/common/lib/utils/content-graph/isced-grade'
import { contentSlug } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import isced_grades from './CL_ISCED11-Grades'

export const getIscedGrades = () =>
  isced_grades.map(grade => {
    const iscedGrade: IscedGrade = {
      _type: 'IscedGrade',
      _permId: grade.code,
      _slug: contentSlug({ name: grade.desc, slugCode: grade.code }),
      name: grade.desc,
      codePath: getIscedGradePathByCode(grade.code)!,
      code: grade.code,
      description: grade.desc,
    }
    return iscedGrade
  })

// console.log(iscedfields)
