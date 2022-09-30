/// <reference path="../moodlenet-react-app-lib.d.ts" />
import authConn from '@moodlenet/authentication-manager'
import graphConn from '@moodlenet/content-graph'
import { connectPkg } from '@moodlenet/core'
import organizationConn from '@moodlenet/organization'
import apis from './apis.mjs'
import { addWebappPluginItem } from './init.mjs'
import { WebPkgDeps } from './webapp/MainContext.js'

export * from './types.mjs'

// import { fileURLToPath } from 'url'
// const __dirname = fileURLToPath(new URL('.', import.meta.url))
// export * from './pub-lib.mjs'
// export * from './types.mjs'

const connection = await connectPkg(import.meta, apis)
export default connection

const WebPkgDeps: WebPkgDeps = [connection, organizationConn, authConn, graphConn]
await addWebappPluginItem<WebPkgDeps>({
  guestPkgInfo: connection.pkgInfo,
  // mainComponentLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainComponent.tsx'),
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: WebPkgDeps,
})
