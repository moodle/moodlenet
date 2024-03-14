import { shell } from './shell.mjs'

import { RpcStatus } from '@moodlenet/core'
import { defaultImageUploadMaxSize, getWebappUrl } from '@moodlenet/react-app/server'
import type {
  AccessEntitiesRecordType,
  AqlVal,
  EntityInfo,
} from '@moodlenet/system-entities/server'
import {
  creatorUserInfoAqlProvider,
  getCurrentUserInfo,
  isCurrentUserCreatorOfCurrentEntity,
} from '@moodlenet/system-entities/server'
import type { CollectionExposeType } from '../common/expose-def.mjs'
import type { CollectionContributorRpc, CollectionRpc } from '../common/types.mjs'
import { getCollectionHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import {
  createCollection,
  delCollection,
  getCollection,
  getMyCollections,
  getValidations,
  patchCollection,
  searchCollections,
  setCollectionImage,
  setPublished,
  updateCollectionContent,
} from './services.mjs'

import { getImageAssetInfo, getImageUrl } from './lib.mjs'
import type { CollectionDataType } from './types.mjs'

export const expose = await shell.expose<CollectionExposeType>({
  rpc: {
    'webapp/get-configs': {
      guard: () => void 0,
      async fn() {
        const { config } = await getValidations()
        return { validations: config }
      },
    },
    'webapp/my-collections': {
      guard: () => void 0,
      async fn() {
        const meEntityInfo = await getCurrentUserInfo()
        const contributor = getRpcContributor(meEntityInfo)
        const myCollectionsCursor = await getMyCollections({
          projectAccess: ['u', 'd'],
          project: {
            canPublish: canPublish(),
          },
        })
        const myCollectionsDocs = await myCollectionsCursor.all()
        const collections = myCollectionsDocs.map(_ => {
          const collectionRpc = getCollectionRpc({ ..._, isCreator: true })
          return collectionRpc
        })

        return {
          collections,
          contributor,
        }
      },
    },
    'webapp/my-collections/:containingResourceKey': {
      guard: () => void 0,
      async fn(_, { containingResourceKey }) {
        const myCollectionsCursor = await getMyCollections({
          projectAccess: ['u'],
        })
        const myCollectionsDocs = await myCollectionsCursor.all()

        return myCollectionsDocs
          .filter(({ access }) => access.u)
          .map(({ entity: { _key, title, resourceList } }) => {
            const resourceListKeys = resourceList.map(({ _key }) => _key)
            return {
              collectionKey: _key,
              collectionName: title,
              hasResource: resourceListKeys.includes(containingResourceKey),
            }
          })
      },
    },
    'webapp/in-collection/:collectionKey/:action(add|remove)/:resourceKey': {
      guard: () => void 0,
      async fn(_, { action, collectionKey, resourceKey }) {
        const updateResult = await updateCollectionContent(collectionKey, action, resourceKey)
        if (!updateResult) {
          return //throw ?
        }
        return
      },
    },
    'webapp/set-is-published/:_key': {
      guard: body => typeof body.publish === 'boolean',
      async fn({ publish }, { _key }) {
        const patchResult = await setPublished(_key, publish)
        if (!patchResult) {
          if (patchResult === null) {
            throw RpcStatus('Not Found')
          }
          if (patchResult === undefined) {
            throw RpcStatus('Unauthorized')
          }
          throw RpcStatus('Precondition Failed')
        }
        return
      },
    },
    'webapp/get/:_key': {
      guard: () => void 0,
      async fn(_, { _key }) {
        const found = await getCollection(_key, {
          projectAccess: ['u', 'd'],
          project: {
            canPublish: canPublish(),
            isCreator: isCurrentUserCreatorOfCurrentEntity(),
            contributor: creatorUserInfoAqlProvider(),
          },
        })
        if (!found) {
          return null
        }

        const contributor: CollectionContributorRpc = getRpcContributor(found.contributor)
        const collectionRpcNoContrib = getCollectionRpc(found)
        const collectionRpc: CollectionRpc = {
          contributor,
          ...collectionRpcNoContrib,
        }
        return collectionRpc
      },
    },
    'webapp/edit/:_key': {
      guard: async body => {
        const { draftCollectionValidationSchema } = await getValidations()

        body.values = await draftCollectionValidationSchema.validate(body?.values, {
          stripUnknown: true,
        })
      },
      async fn({ values }, { _key }) {
        await patchCollection(_key, values)
      },
    },
    'webapp/create': {
      guard: () => void 0,
      async fn() {
        const createResult = await createCollection({})
        if (!createResult) {
          throw RpcStatus('Unauthorized')
        }
        return {
          _key: createResult._key,
        }
      },
    },
    'webapp/delete/:_key': {
      guard: () => void 0,
      async fn(_, { _key }) {
        const delResult = await delCollection(_key)
        if (!delResult) {
          return
        }
        return
      },
    },
    'webapp/upload-image/:_key': {
      guard: async body => {
        const { imageValidationSchema } = await getValidations()
        const validatedImageOrNullish = await imageValidationSchema.validate(
          { image: body?.file?.[0] },
          { stripUnknown: true },
        )
        body.file = [validatedImageOrNullish?.image]
      },
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getCollection(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }

        const updateRes = await setCollectionImage(_key, uploadedRpcFile)
        if (!updateRes) {
          throw RpcStatus('Expectation Failed')
        }
        // console.log({ patched: updateRes?.patched.image, got: got.entity.image })
        const imageUrl = updateRes?.patched.image ? getImageUrl(updateRes.patched.image) : null
        return imageUrl
      },
      bodyWithFiles: {
        maxSize: defaultImageUploadMaxSize,
        fields: {
          '.file': 1,
        },
      },
    },
    'webapp/search': {
      guard: () => void 0,
      async fn(_, __, { limit, sortType, text, after }) {
        const { endCursor, list } = await searchCollections({ limit, sortType, text, after })
        return {
          list: list.map(({ entity: { _key } }) => ({ _key })),
          endCursor,
        }
      },
    },
  },
})
function getCollectionRpc(
  found: AccessEntitiesRecordType<
    CollectionDataType,
    {
      canPublish: AqlVal<boolean>
      isCreator: AqlVal<boolean>
    },
    'u' | 'd'
  >,
) {
  const image = getImageAssetInfo(found.entity.image)
  const collectionRpc: Omit<CollectionRpc, 'contributor'> = {
    resourceList: found.entity.resourceList,
    form: {
      description: found.entity.description,
      title: found.entity.title,
    },
    data: {
      id: found.entity._key,
      mnUrl: getWebappUrl(
        getCollectionHomePageRoutePath({ _key: found.entity._key, title: found.entity.title }),
      ),
      image,
    },
    state: {
      numResources: found.entity.resourceList.length,
      isPublished: found.entity.published,
    },
    access: {
      canDelete: !!found.access.d,
      canEdit: !!found.access.u,
      canPublish: found.canPublish,
      isCreator: found.isCreator,
    },
  }
  return collectionRpc
}

function getRpcContributor(contributor: EntityInfo): CollectionContributorRpc {
  return {
    avatarUrl: contributor.iconUrl,
    creatorProfileHref: {
      url: contributor.homepagePath,
      ext: false,
    },
    displayName: contributor.name,
    // avatarUrl: contributor?.iconUrl ?? null,
    // creatorProfileHref: {
    //   url: 'google.it',
    //   ext: true,
    // },
    // displayName: 'contributor.name',
  }
}
