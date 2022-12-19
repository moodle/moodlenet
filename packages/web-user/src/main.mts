import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { MyPkgContext } from './main.mjs'

import { reactAppPkg } from './use-pkg-apis.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })

await reactAppPkg.api('plugin')<MyPkgContext>({
  def: {
    mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
    usesPkgs: {},
  },
})

export default connection
