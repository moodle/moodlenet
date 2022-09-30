import { confirm } from './lib.mjs'
import { httpPkgApis } from './use-pkg-apis.mjs'

httpPkgApis('mount')({
  getApp: function getHttpApp(express) {
    const app = express()
    app.get('/confirm-email/:token', async (req, res) => {
      const { token } = req.params
      const confirmResp = await confirm({ token })

      if (!confirmResp.success) {
        res.status(400).end(confirmResp.msg)
        return
      }
      res.redirect(`/@moodlenet/simple-email-auth/confirm-email?sessionToken=${confirmResp.sessionToken}`)
    })
    return app
  },
})
