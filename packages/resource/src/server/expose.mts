import { GetResponce, ResourceFormValues } from '../common.mjs'
import {
  deleteResource,
  editResource,
  getResource,
  ParamResourceId,
  toggleBookmark,
  toggleLike,
  uploadResource,
} from './mockLib.mjs'
import shell from './shell.mjs'

// const makeRpc = <DefItem extends RpcDefItem>(fn: RpcFnOf<DefItem>): DefItem =>
//   ({
//     guard: () => void 0,
//     fn,
//   } as unknown as DefItem)

export const expose = await shell.expose({
  rpc: {
    'webapp/upload': {
      guard: () => void 0,
      fn: async ({ param }: ParamResourceId) => await uploadResource(param),
    }, // makeRpc(async () => await loadResources()),
    'webapp/get': {
      guard: () => void 0,
      fn: async ({ param }: ParamResourceId): Promise<ResourceTypeForm> => ({
        resourceData: await getResource(param),
        authFlags: {
          isAuthenticated: true,
          isOwner: true,
          canEdit: true,
          isAdmin: true,
        },
        flags: {
          liked: true,
          bookmarked: false,
          isPublished: false,
        },
      }),
    },
    'webapp/edit': {
      guard: () => void 0,
      fn: async (resourceKey: string, res: ResourceFormValues) =>
        await editResource(resourceKey, res),
    },
    'webapp/delete': {
      guard: () => void 0,
      fn: async (res: ResourceTypeForm) => await deleteResource(res),
    },
    'webapp/toggleBookmark': {
      guard: () => void 0,
      fn: async (resId: string) => await toggleBookmark(resId),
    },
    'webapp/toggleLike': {
      guard: () => void 0,
      fn: async (resId: string) => await toggleLike(resId),
    },
    'webapp/setIsPublished': {
      guard: () => void 0,
      fn: async (resId: string) => await toggleLike(resId),
    },
  },
})
