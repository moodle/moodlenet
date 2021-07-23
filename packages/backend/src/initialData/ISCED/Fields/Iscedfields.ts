import { contentSlug } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { getIscedfieldPathByCode } from '@moodlenet/common/lib/utils/content-graph/subject-field'
import { ShallowNodeByType } from '../../../graphql/types.node'
import { rndImgAssetRef } from '../../helpers'
import isced_fields from './CL_ISCED13-Fields'

export const iscedfields = isced_fields.map(field => {
  const iscedfield: Omit<ShallowNodeByType<'Iscedfield'>, 'id'> = {
    name: field.desc,
    codePath: getIscedfieldPathByCode(field.code)!,
    iscedCode: field.code,
    description: field.desc,
    thumbnail: rndImgAssetRef('thmb', field.code),
    image: rndImgAssetRef('img', field.code),
    slug: contentSlug(field.desc, field.code),
  }
  return iscedfield
})

// console.log(iscedfields)
