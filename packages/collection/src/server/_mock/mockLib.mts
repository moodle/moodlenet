import { CollectionFormRpc, CollectionRpc } from '../../common/types.mjs'
import { resFakeData } from './fakeData.mjs'

const getFakeData = (collectionId: string, query?: File | string | boolean): CollectionRpc =>
  collectionId || query ? resFakeData : resFakeData

// prettier-ignore
const newPromise = <T,>(r: T):Promise<T> => new Promise<T>(resolve => resolve(r))
const resolver = (collectionId: string, query?: File | string | boolean) =>
  newPromise(getFakeData(collectionId, query))

export const empityFormModel: CollectionRpc = {
  data: {
    collectionId: 'new123',
    mnUrl: '',
    imageUrl: '',
    isWaitingForApproval: false,
  },
  form: { description: '', title: '' },
  state: {
    isPublished: false,
    followed: false,
    numResources: 0,
    numFollowers: 0,
    bookmarked: false,
  },
  access: {
    isCreator: true,
    canEdit: true,
    canPublish: true,
    canDelete: true,
    canFollow: true,
    canBookmark: false,
    isAuthenticated: true,
  },
  contributor: {
    avatarUrl: '',
    displayName: '',
    creatorProfileHref: { url: '', ext: false },
  },
}

export const get = async (collectionId: string, query?: string) =>
  newPromise<CollectionRpc>(
    collectionId === 'new123' ? empityFormModel : getFakeData(collectionId, query),
  )
export const edit = (_key: string, values: CollectionFormRpc) =>
  newPromise<CollectionFormRpc>(values)
export const _delete = (collectionId: string) => resolver(collectionId)
export const toggleFollow = (collectionId: string) => resolver(collectionId)
export const toggleBookmark = (collectionId: string) => resolver(collectionId)
export const setIsPublished = (collectionId: string, publish: boolean) =>
  resolver(collectionId, publish)
export const setImage = (key: string, file: File) => resolver(key, file)
export const create = () => newPromise(empityFormModel)

export const mockModel = {
  // empityFormModel,
  // get,
  // edit,
  _delete,
  toggleFollow,
  setIsPublished,
  toggleBookmark,
  setImage,
}
