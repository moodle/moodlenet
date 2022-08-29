import { extLibForFactory } from './ext-lib-factory'
import type { ContentGraphExt, ContentGraphKVStore } from './types'
import { getCollectionName } from './utils'
export * from './types'

export const ext: ContentGraphExt = {
  name: '@moodlenet/content-graph',
  version: '0.1.0',
  requires: [
    '@moodlenet/core@0.1.0',
    '@moodlenet/arangodb@0.1.0',
    '@moodlenet/key-value-store@0.1.0',
    '@moodlenet/authentication-manager@0.1.0',
  ],
  async connect(shell) {
    const [, arangoSrv, kvStoreSrv, authSrv] = shell.deps
    const kvStore = await kvStoreSrv.plug.getStore<ContentGraphKVStore>()
    const libFor = await extLibForFactory(shell, kvStore)
    const myLib = libFor(true)
    shell.onExtUninstalled(async ({ extName }) => {
      const { collectionsMeta } = await arangoSrv.plug.collections()
      const myPrefix = getCollectionName(extName, '')
      await Promise.all(
        collectionsMeta
          .filter(collectionMeta => collectionMeta.name.startsWith(myPrefix))
          .map(collectionMeta => arangoSrv.plug.dropCollection({ name: collectionMeta.name })),
      )
    })
    return {
      deploy() {
        shell.expose({
          'getMyUserNode/sub': {
            validate() {
              return { valid: true }
            },
          },
        })
        shell.provide.services({
          async getMyUserNode(_, msg) {
            console.log('APAP', { msg })
            const clientSession = await authSrv.plug.getMsgClientSession({ msg })
            console.log('APAP', { clientSession })
            if (!clientSession?.user) {
              return
            }
            const result = await myLib.getAuthenticatedNode({ userId: clientSession.user.id })
            if (!result) {
              return
            }
            return { node: result.node }
          },
        })
        return {
          plug({ shell }) {
            return libFor(shell.extId)
          },
        }
      },
    }
  },
}

export default ext
