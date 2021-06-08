import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { getSubjectFieldPathByCode } from '@moodlenet/common/lib/utils/content-graph/subject-field'
import { ShallowNodeByType } from '../../../graphql/types.node'
import { rndImgAssetRef } from '../../helpers'
import isced_fields from './CL_ISCED13-Fields'

export const subjectFields = isced_fields.map<ShallowNodeByType<'SubjectField'>>(field => {
  return {
    id: `SubjectField/${field.code}` as ID,
    name: field.desc,
    path: getSubjectFieldPathByCode(field.code)!,
    summary: field.desc,
    icon: rndImgAssetRef(field.code),
  }
})

// console.log(subjectFields)
