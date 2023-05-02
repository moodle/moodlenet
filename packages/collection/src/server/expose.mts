import { shell } from './shell.mjs'

import { RpcStatus } from '@moodlenet/core'
import { getWebappUrl, webImageResizer } from '@moodlenet/react-app/server'
import { creatorUserInfoAqlProvider, isCreator } from '@moodlenet/system-entities/server'
import { CollectionExposeType } from '../common/expose-def.mjs'
import { CollectionRpc } from '../common/types.mjs'
import { getCollectionHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { publicFiles, publicFilesHttp } from './init.mjs'
import {
  createCollection,
  delCollection,
  getCollection,
  getImageLogicalFilename,
  patchCollection,
} from './lib.mjs'

export const expose = await shell.expose<CollectionExposeType>({
  rpc: {
    'webapp/set-is-published/:_key': {
      guard: () => void 0,
      async fn({ publish }, { _key }) {
        const patchResult = await patchCollection(_key, { published: publish })
        if (!patchResult) {
          return //throw ?
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
            isCreator: isCreator(),
            contributor: creatorUserInfoAqlProvider(),
          },
        })
        if (!found) {
          return
        }
        const imageUrl = found.entity.image
          ? publicFilesHttp.getFileUrl({ directAccessId: found.entity.image.directAccessId })
          : ''

        const collectionRpc: CollectionRpc = {
          contributor: {
            avatarUrl: found.contributor.iconUrl,
            creatorProfileHref: {
              url: found.contributor.homepagePath,
              ext: false,
            },
            displayName: found.contributor.name,
          },

          form: { description: found.entity.description, title: found.entity.title },
          data: {
            collectionId: found.entity._key,
            mnUrl: getWebappUrl(getCollectionHomePageRoutePath({ _key })),
            imageUrl,
            isWaitingForApproval: false,
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
      },
    },
    'webapp/edit/:_key': {
      guard: () => void 0,
      async fn({ values }, { _key }) {
        const patchResult = await patchCollection(_key, values)
        if (!patchResult) {
          return
        }
        return
      },
    },
    'webapp/create': {
      guard: () => void 0,
      async fn() {
        const createResult = await createCollection({
          description: '',
          title: '',
          image: null,
          published: false,
          resourceList: [],
        })
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
        const imageLogicalFilename = getImageLogicalFilename(_key)
        await publicFiles.del(imageLogicalFilename)

        return
      },
    },
    'webapp/upload-image/:_key': {
      guard: () => void 0,
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getCollection(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        const imageLogicalFilename = getImageLogicalFilename(_key)

        const resizedRpcFile = await webImageResizer(uploadedRpcFile, 'image')

        const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

        await patchCollection(_key, {
          image: { kind: 'file', directAccessId },
        })
        return publicFilesHttp.getFileUrl({ directAccessId })
      },
      bodyWithFiles: {
        fields: {
          '.file': 1,
        },
      },
    },
  },
})
