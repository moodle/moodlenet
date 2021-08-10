import { slugify } from '../../../utils/content-graph/slug-id'
import { ResourceType } from '../../types/node'
import resourceTypesData from './resource-type-DATA'

export const getResourceTypes = () =>
  resourceTypesData.map(resourceTypeData => {
    const resourceType: ResourceType = {
      _type: 'ResourceType',
      _permId: resourceTypeData.code,
      _slug: slugify({ str: resourceTypeData.desc }),
      code: resourceTypeData.code,
      name: resourceTypeData.desc,
      description: resourceTypeData.desc,
    }
    return resourceType
  })
