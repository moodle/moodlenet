import type { MNArangoDBExt } from '@moodlenet/arangodb'
import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import storeFactory from './store'
import { GetStore } from './types'
export * from './types'

export type Lib = {
  getStore: GetStore
}

export type KeyValueStoreExtDef = ExtDef<'@moodlenet/key-value-store', '0.1.0', Lib>

export type KeyValueStoreExt = Ext<KeyValueStoreExtDef, [CoreExt, MNArangoDBExt]>
const ext: KeyValueStoreExt = {
  name: '@moodlenet/key-value-store',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/arangodb@0.1.0'],
  connect(_shell) {
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
