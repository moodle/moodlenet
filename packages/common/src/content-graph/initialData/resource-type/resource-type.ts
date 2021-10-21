import { slugify } from '../../../utils/content-graph/slug-id'
import { ResourceType } from '../../types/node'
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
    }
    return resourceType
  })
