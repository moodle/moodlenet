import { getIscedGradePathByCode } from '../../../../utils/content-graph/isced-grade'
import { contentSlug } from '../../../../utils/content-graph/slug-id'
import { IscedGrade } from '../../../types/node'
import isced_grades from './CL_ISCED11-Grades'

export const getIscedGrades = () =>
  isced_grades.map(grade => {
    const iscedGrade: IscedGrade = {
      _type: 'IscedGrade',
      _permId: grade.code,
      _slug: contentSlug({ name: grade.desc, slugCode: grade.code }),
      _published: true,
      name: grade.desc,
      codePath: grade.code === 'ADT' ? [grade.code] : getIscedGradePathByCode(grade.code),
      code: grade.code,
      description: grade.desc,
    }
    return iscedGrade
  })

// console.log(iscedfields)
