import { Iscedf } from '@moodlenet/common/lib/content-graph/types/node'
import { contentSlug } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { getIscedfieldPathByCode } from '@moodlenet/common/lib/utils/content-graph/subject-field'
import { rndImgAssetRef } from '../../helpers'
import isced_fields from './CL_ISCED13-Fields'

export const getIscedfields = () =>
  isced_fields.map(field => {
    const iscedfield: Omit<Iscedf, '_permId' | '_bumpStatus'> = {
      name: field.desc,
      codePath: getIscedfieldPathByCode(field.code)!,
      iscedCode: field.code,
      description: field.desc,
      thumbnail: rndImgAssetRef('thmb', field.code),
      image: rndImgAssetRef('img', field.code),
      _slug: contentSlug({ name: field.desc, slugCode: field.code }),
      _type: 'Iscedf',
    }
    return iscedfield
  })

// console.log(iscedfields)
