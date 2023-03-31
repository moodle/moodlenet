import { CollectionDataResponce, CollectionFormValues } from '../common/types.mjs'
import { resFakeData } from './fakeData.mjs'

const getFakeData = (resourceKey: string, query?: string): CollectionDataResponce =>
  resourceKey || query ? resFakeData : resFakeData

// prettier-ignore
const newPromise = <T,>(r: T):Promise<T> => new Promise<T>(resolve => resolve(r))
const resolver = (resourceKey: string, param?: unknown) => newPromise({ resourceKey, param })

const empityFormModel: CollectionDataResponce = {
  data: {
    collectionId: 'new123',
    mnUrl: '',
    imageUrl: '',
    isWaitingForApproval: false,
  },
  form: { description: '', title: '' },
  state: {
    isPublished: false,
    numResources: 0,
  },
  access: {
    isAuthenticated: true,
    isCreator: true,
    canEdit: true,
    canPublish: true,
    canDelete: true,
  },
  contributor: {
    avatarUrl: '',
    displayName: '',
    creatorProfileHref: { url: '', ext: false },
  },
}

const get = async (resourceKey: string, query?: string) =>
  newPromise<CollectionDataResponce>(
    resourceKey === 'new123' ? empityFormModel : getFakeData(resourceKey, query),
  )
const edit = (_resourceKey: string, res: CollectionFormValues) =>
  newPromise<CollectionFormValues>(res)
const _delete = (resourceKey: string) => resolver(resourceKey)
const toggleFollow = (resourceKey: string) => resolver(resourceKey)
const toggleBookmark = (resourceKey: string) => resolver(resourceKey)
const setIsPublished = (resourceKey: string, publish: boolean) => resolver(resourceKey, publish)
const setImage = (resourceKey: string, file: File) => resolver(resourceKey, file)

export const mockModel = {
  empityFormModel,
  get,
  edit,
  _delete,
  toggleFollow,
  setIsPublished,
  toggleBookmark,
  setImage,
}
