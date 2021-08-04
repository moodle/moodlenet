import { IscedField } from '@moodlenet/common/lib/content-graph/types/node'
import { getIscedFieldPathByCode } from '@moodlenet/common/lib/utils/content-graph/isced-field'
import { contentSlug } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import isced_fields from './CL_ISCED13-Fields'

export const getIscedFields = () =>
  isced_fields.map(field => {
    const iscedfield: IscedField = {
      _type: 'IscedField',
      _permId: field.code,
      _slug: contentSlug({ name: field.desc, slugCode: field.code }),
      name: field.desc,
      codePath: getIscedFieldPathByCode(field.code)!,
      code: field.code,
      description: field.desc,
    }
    return iscedfield
  })

// console.log(iscedfields)
