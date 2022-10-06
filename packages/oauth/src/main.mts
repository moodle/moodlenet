import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { confirm } from './lib.mjs'
import { httpPkgApis, reactAppPkgApis } from './use-pkg-apis.mjs'
import { WebPkgDeps } from './webapp/types.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, apis)
export default connection

reactAppPkgApis('plugin')<WebPkgDeps>({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: [connection],
})

httpPkgApis('mount')({
  getApp: function getHttpApp(express) {
    const app = express()
    app.get('/confirm-email/:token', async (req, res) => {
      const { token } = req.params
      console.log('/confirm-email/:token', { token })
      const confirmResp = await confirm({ token })
      if (!confirmResp.success) {
        res.status(400).end(confirmResp.msg)
        return
      }
      res.redirect(
        `/@moodlenet/simple-email-auth/confirm-email?sessionToken=${confirmResp.sessionToken}`,
      )
    })
    return app
  },
})
