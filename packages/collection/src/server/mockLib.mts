import { CollectionDataResponce, CollectionFormValues } from '../common/types.mjs'
import { resFakeData } from './fakeData.mjs'

const getFakeData = (resourceKey: string, query?: string): unknown =>
  resourceKey || query ? resFakeData : resFakeData

const empityFormModel = getFakeData('0')

const get = async (resourceKey: string, query?: string): Promise<CollectionDataResponce> =>
  new Promise(resolve => resolve(getFakeData(resourceKey, query) as CollectionDataResponce))

const edit = (_resourceKey: string, res: CollectionFormValues): Promise<unknown> =>
  new Promise(resolve => resolve(res))

const _delete = (resourceKey: string): Promise<unknown> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))

const toggleFollow = (resourceKey: string): Promise<unknown> =>
  new Promise(resolve => resolve(resourceKey))

const setIsPublished = (resourceKey: string): Promise<unknown> =>
  new Promise(resolve => resolve(resourceKey))

export const mockModel = {
  empityFormModel,
  get,
  edit,
  _delete,
  toggleFollow,
  setIsPublished,
}
