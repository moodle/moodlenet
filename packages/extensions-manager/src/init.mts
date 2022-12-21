import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { MyPkgContext } from './common/types.mjs'
import { reactAppPkg } from './use-pkg-apis.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection

await reactAppPkg.api('plugin')<MyPkgContext>({
  def: {
    mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
    usesPkgs: {},
  },
})
