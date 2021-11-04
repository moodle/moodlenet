import { getIscedGradePathByCode } from '../../../../utils/content-graph/isced-grade'
import { contentSlug } from '../../../../utils/content-graph/slug-id'
import { time0 } from '../../../types/common'
import { IscedGrade } from '../../../types/node'
import { __initialLocalOrgAuthId } from '../../content'
import isced_grades from './CL_ISCED11-Grades'

export const getIscedGrades = () =>
  isced_grades.map(grade => {
    const iscedGrade: IscedGrade = {
      _type: 'IscedGrade',
      _permId: grade.code,
      _slug: contentSlug({ name: grade.desc, slugCode: grade.code }),
      _published: /^ED\d{1}$/.test(grade.code),
      name: grade.desc,
      codePath: grade.code === 'ADT' ? [grade.code] : getIscedGradePathByCode(grade.code),
      code: grade.code,
      description: grade.desc,
      _created: time0,
      _edited: time0,
      _authKey: null,
      _creator: __initialLocalOrgAuthId,
      _local: true,
    }
    return iscedGrade
  })
