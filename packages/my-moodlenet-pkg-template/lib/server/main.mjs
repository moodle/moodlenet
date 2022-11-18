import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { reactAppPkg } from './use-pkgs.mjs'

const connection = await connectPkg(import.meta, { apis })

reactAppPkg.api('plugin')({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.jsx'],
  usesPkgs: [connection],
})
