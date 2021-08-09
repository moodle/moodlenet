import { getIscedFieldPathByCode } from '../../../../utils/content-graph/isced-field'
import { contentSlug } from '../../../../utils/content-graph/slug-id'
import { IscedField } from '../../../types/node'
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
