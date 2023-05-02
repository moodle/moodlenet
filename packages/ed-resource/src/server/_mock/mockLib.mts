import { ResourceFormRpc, ResourceRpc } from '../../common/types.mjs'
import { resFakeData } from './fakeData.mjs'

const getFakeData = (resourceKey: string, query?: File | string): ResourceRpc =>
  resourceKey || query ? resFakeData : resFakeData
// prettier-ignore
const newPromise = <T, >(r: T): Promise<T> => new Promise<T>(resolve => resolve(r))
const resolver = (resourceKey: string, query?: File | string): Promise<ResourceRpc> =>
  newPromise(getFakeData(resourceKey, query))

export const empityFormModel: ResourceRpc = {
  data: {
    resourceId: 'aaa123',
    mnUrl: 'http:www.ggg.it',
    contentUrl: 'http:www.ggg.it',
    contentType: 'link',
    downloadFilename: 'resf.pdf',
    imageUrl: 'https://picsum.photos/200/100',
  },
  state: {
    isPublished: true,
  },
  access: {
    isCreator: true,
    canPublish: true,
    canDelete: true,
    canEdit: true,
    canBookmark: false,
    canLike: false,
    isAuthenticated: true,
  },
  resourceForm: {
    description: '',
    title: '',
    license: '', //@ETTO to be filled
    subject: '', //@ETTO to be filled
    language: '', //@ETTO to be filled
    level: '', //@ETTO to be filled
    month: '', //@ETTO to be filled
    year: '', //@ETTO to be filled
    type: '', //@ETTO to be filled
  },
  contributor: {
    avatarUrl: null,
    displayName: '',
    timeSinceCreation: '',
    creatorProfileHref: { ext: false, url: '' },
  },
}

export const get = async (resourceKey: string, query?: string) =>
  newPromise<ResourceRpc>(
    resourceKey === 'new123' ? empityFormModel : getFakeData(resourceKey, query),
  )
export const edit = (_resourceKey: string, res: ResourceFormRpc) => newPromise<ResourceFormRpc>(res)
export const _delete = (resourceKey: string) => resolver(resourceKey)
export const upload = async (resourceKey: string) => resolver(resourceKey)
export const toggleLike = (resourceKey = '') => resolver(resourceKey)
export const toggleBookmark = (resourceKey = '') => resolver(resourceKey)
export const setIsPublished = (resourceKey = '') => resolver(resourceKey)
export const setImage = (resourceKey: string, file: File) => resolver(resourceKey, file)
export const setContent = (resourceKey: string, file: File | string) => resolver(resourceKey, file)
export const create = () => newPromise(empityFormModel)
