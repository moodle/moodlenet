import { ResourceFormValues, ResourceTypeForm } from '../common/types.mjs'
import { resFakeData, resFakes } from './fakeData.mjs'

const getFakeData = (resourceKey: string) => (resourceKey ? resFakeData : resFakeData)

export type ResultData = [string | null, ResourceTypeForm | null]
export type ParamResource = { param: ResourceTypeForm }
export type ParamResourceId = { param: string }

export const editResource = (
  resourceKey: string,
  res: ResourceFormValues,
): Promise<ResourceFormValues> =>
  new Promise(resolve => resolve(res))

export const deleteResource = (resourceKey: string): Promise<ResourceTypeForm> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))

export const loadResources = async (): Promise<ResourceTypeForm[]> => resFakes

export const getResource = async (resourceKey: string): Promise<ResourceTypeForm> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))

export const uploadResource = async (resourceKey: string): Promise<ResourceTypeForm> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))

export const toggleLike = (resourceKey = ''): Promise<ResourceTypeForm> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))
export const toggleBookmark = (resourceKey = ''): Promise<ResourceTypeForm> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))

export const setIsPublished = (resourceKey = ''): Promise<ResourceTypeForm> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))
