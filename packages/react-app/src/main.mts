/// <reference path="../moodlenet-react-app-lib.d.ts" />
import authConn from '@moodlenet/authentication-manager'
import graphConn from '@moodlenet/content-graph'
import { connectPkg } from '@moodlenet/core'
import organizationConn from '@moodlenet/organization'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import apis from './apis.mjs'
import { addWebappPluginItem } from './init.mjs'
import { MyUsesPkgs } from './webapp/MainContext.js'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
// export * from './pub-lib.mjs'
// export * from './types.mjs'

const connection = await connectPkg(import.meta, apis)
export default connection

const MyUsesPkgs: MyUsesPkgs = [connection, organizationConn, authConn, graphConn]
await addWebappPluginItem({
  guestPkgId: connection.pkgId,
  // mainComponentLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainComponent.tsx'),
  mainComponentLoc: resolve(__dirname, 'webapp', 'MainComponent.js'),
  usesPkgs: MyUsesPkgs,
})
