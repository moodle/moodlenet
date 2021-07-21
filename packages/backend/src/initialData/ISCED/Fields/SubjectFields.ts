import { getSubjectFieldPathByCode } from '@moodlenet/common/lib/utils/content-graph/subject-field'
import { ShallowNodeByType } from '../../../graphql/types.node'
import { rndImgAssetRef } from '../../helpers'
import isced_fields from './CL_ISCED13-Fields'

export const subjectFields = isced_fields.map<Omit<ShallowNodeByType<'SubjectField'>, 'id'>>(field => {
  return {
    name: field.desc,
    codePath: getSubjectFieldPathByCode(field.code)!,
    code: field.code,
    summary: field.desc,
    icon: rndImgAssetRef(field.code),
  }
})

// console.log(subjectFields)
