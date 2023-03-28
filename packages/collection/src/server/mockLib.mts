import { resFakeData } from './fakeData.mjs'

const getFakeData = (resourceKey: string): unknown => (resourceKey ? resFakeData : resFakeData)

export const empityFormModel = getFakeData('0')
const get = async (resourceKey: string): Promise<unknown> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))
const edit = (_resourceKey: string, res: unknown): Promise<unknown> =>
  new Promise(resolve => resolve(res))

const _delete = (resourceKey: string): Promise<unknown> =>
  new Promise(resolve => resolve(getFakeData(resourceKey)))

const toggleFollow = (resourceKey: string): Promise<unknown> =>
  new Promise(resolve => resolve(resourceKey))

const setIsPublished = (resourceKey: string): Promise<unknown> =>
  new Promise(resolve => resolve(resourceKey))

export const mockModel = {
  get,
  edit,
  _delete,
  toggleFollow,
  setIsPublished,
}
