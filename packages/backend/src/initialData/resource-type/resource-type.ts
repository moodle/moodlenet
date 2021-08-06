import { ResourceType } from '@moodlenet/common/lib/content-graph/types/node'
import { slugify } from '@moodlenet/common/lib/utils/content-graph/slug-id'
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
