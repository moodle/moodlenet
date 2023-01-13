import { connectPkg } from '@moodlenet/core'
import auth from '@moodlenet/authentication-manager/init'
import apis from './apis.mjs'
import { MyPkgContext } from './common/types.mjs'
import { confirm } from './lib.mjs'
import { httpPkg, reactAppPkg } from './use-pkg-apis.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection

reactAppPkg.api('plugin')<MyPkgContext>({
  def: {
    mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
    deps: { auth },
  },
})

httpPkg.api('mount')({
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
