import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { httpPkgApis } from './use-pkg-apis.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, apis)
export default connection

/* reactAppPkgApis('plugin')<WebPkgDeps>({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: [connection],
}) */

httpPkgApis('mount')({
  mountOnAbsPath: '/oauth/v2/',
  getApp: function getHttpApp(express) {
    const app = express()
    app.get('/authorize', async (_, __) => {
      console.log('/confirm-email/:token')
    })
    return app
  },
})
