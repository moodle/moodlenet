import { defApi, PkgModuleRef } from '@moodlenet/core'
import storeFactory from './store.mjs'

export default {
  getStore: defApi(
    ctx =>
      async ({ consumerModuleRef }: { consumerModuleRef: PkgModuleRef }) => {
        ctx.caller.pkgId
        storeFactory({ consumerModuleRef })
      },
    () => true,
  ),
}
