import { slugify } from '../../../utils/content-graph/slug-id'
import { ResourceType } from '../../types/node'
import resourceTypesData from './resource-type-DATA'
const now = Number(new Date())
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
      _created: now,
      _edited: now,
      _authKey: null,
    }
    return resourceType
  })
