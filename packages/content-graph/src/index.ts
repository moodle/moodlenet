import { extLibForFactory } from './ext-lib-factory'
import type { ContentGraphStoreExt } from './types'
import { getCollectionName } from './utils'
export * from './types'

export const ext: ContentGraphStoreExt = {
  name: '@moodlenet/content-graph',
  version: '0.1.0',
  requires: [
    '@moodlenet/core@0.1.0',
    '@moodlenet/arangodb@0.1.0',
    '@moodlenet/key-value-store@0.1.0',
    '@moodlenet/react-app@0.1.0',
    '@moodlenet/authentication-manager@0.1.0',
  ],
  async connect(shell) {
    const [, arangoSrv, _kvStore] = shell.deps
    const libFor = await extLibForFactory(shell)

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
