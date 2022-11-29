import { defApi } from '@moodlenet/core'
import storeFactory from './store.mjs'
import { KVSTypeMap } from './types.js'

export default {
  getStore: defApi(
    ctx =>
      async <TMap extends KVSTypeMap>() => {
        return storeFactory<TMap>({ consumerModuleRef: ctx.caller.moduleRef })
      },
    () => true,
  ),
}
