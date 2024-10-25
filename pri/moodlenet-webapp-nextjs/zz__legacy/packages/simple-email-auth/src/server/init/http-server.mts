import { mountApp } from '@moodlenet/http-server/server'
import { getProfileHomePageRoutePath } from '@moodlenet/web-user/common'
import { confirm } from '../lib.mjs'
import { shell } from '../shell.mjs'

shell.call(mountApp)({
  getApp: function getHttpApp(express) {
    const app = express()
    app.get('/confirm-email/:confirmToken', async (req, res) => {
      const { confirmToken } = req.params
      const confirmResp = await confirm({ confirmToken }).catch(e => {
        // shell.log('debug', e)
        res.status(500).send(e)
        throw e
      })
      if (!confirmResp.success) {
        res.status(400).end(confirmResp.msg)
        return
      }

      res.redirect(
        getProfileHomePageRoutePath({
          _key: confirmResp.newProfile._key,
          displayName: confirmResp.newProfile.displayName,
        }),
      )
    })
    return app
  },
})
