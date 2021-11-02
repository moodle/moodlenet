import { slugify } from '../../../utils/content-graph/slug-id'
import { time0 } from '../../types/common'
import { ResourceType } from '../../types/node'
import { __initialLocalOrgAuthId } from '../content'
import resourceTypesData from './resource-type-DATA'

export const getResourceTypes = () =>
  resourceTypesData.map(resourceTypeStr => {
    const slugifiedType = slugify({ str: resourceTypeStr })

    const resourceType: ResourceType = {
      _type: 'ResourceType',
      _permId: slugifiedType,
      _slug: slugifiedType,
      _published: true,
      code: slugifiedType,
      name: resourceTypeStr,
      description: resourceTypeStr,
      _created: time0,
      _edited: time0,
      _authKey: null,
      _creator: __initialLocalOrgAuthId,
      _local: true,
    }
    return resourceType
  })
