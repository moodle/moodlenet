import { ResourceFormValues, ResourceTypeForm } from '../common/types.mjs'
import { resFakeData } from './fakeData.mjs'

const getFakeData = (resourceKey: string, param?: any): ResourceTypeForm =>
  resourceKey || param ? resFakeData : resFakeData
const resolver = (
  resourceKey: string,
  param?: Record<string, any> | string,
): Promise<ResourceTypeForm> => new Promise(resolve => resolve(getFakeData(resourceKey, param)))

export const empityResourceForm = getFakeData('0')

export const editResource = (
  _resourceKey: string,
  res: ResourceFormValues,
): Promise<ResourceFormValues> => new Promise<ResourceFormValues>(resolve => resolve(res))
export const deleteResource = (resourceKey: string) => resolver(resourceKey)
export const getResource = async (resourceKey: string) => resolver(resourceKey)
export const uploadResource = async (resourceKey: string) => resolver(resourceKey)
export const toggleLike = (resourceKey = '') => resolver(resourceKey)
export const toggleBookmark = (resourceKey = '') => resolver(resourceKey)
export const setIsPublished = (resourceKey = '') => resolver(resourceKey)
export const setImage = (resourceKey: string, file: File) => resolver(resourceKey, file)
export const setContent = (resourceKey: string, file: File | string) => resolver(resourceKey, file)
