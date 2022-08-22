import type { MNArangoDBExt } from '@moodlenet/arangodb'
import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import storeFactory from './store'
import { ContentGraphCollections } from './types'
export * from './types'

export type Lib = {}

export type ContentGraphStoreExtDef = ExtDef<'@moodlenet/content-graph', '0.1.0', Lib>

export type ContentGraphStoreExt = Ext<ContentGraphStoreExtDef, [CoreExt, MNArangoDBExt, KeyValueStoreExtDef]>

const ext: ContentGraphStoreExt = {
  name: '@moodlenet/content-graph',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/arangodb@0.1.0', '@moodlenet/key-value-store@0.1.0'],
  async connect(shell) {
    const [, arangoSrv, kvStore] = shell.deps
    const contentGraphCollections = await arangoSrv.plug.ensureDocumentCollections<ContentGraphCollections>({
      defs: {
        Created: ['edge'],
        Updated: ['edge'],
        Deleted: ['edge'],
      },
    })

    return {
      deploy() {
        return {
          plug({ shell }) {
            return {
              getStore: () => storeFactory({ consumerShell: shell }),
            }
          },
        }
      },
    }
  },
}

export default ext
