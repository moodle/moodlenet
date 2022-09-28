/// <reference path="../moodlenet-react-app-lib.d.ts" />
import authConn from '@moodlenet/authentication-manager'
import graphConn from '@moodlenet/content-graph'
import { pkgApis } from '@moodlenet/core'
import organizationConn from '@moodlenet/organization'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import apis from './apis.mjs'
import { addWebappPluginItem } from './init.mjs'
import { MyUsesPkgs } from './webapp/MainContext.js'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
// export * from './pub-lib.mjs'
// export * from './types.mjs'

const apisRef = await pkgApis(import.meta, apis)

const MyUsesPkgs: MyUsesPkgs = [apisRef, organizationConn, authConn, graphConn]
await addWebappPluginItem({
  guestPkgId: apisRef.pkgId,
  // mainComponentLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainComponent.tsx'),
  mainComponentLoc: resolve(__dirname, 'webapp', 'MainComponent.js'),
  usesPkgs: MyUsesPkgs,
})

export default apisRef
