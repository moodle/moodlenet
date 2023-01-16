import { expose as auth } from '@moodlenet/authentication-manager'
import { expose as me } from './expose.mjs'
import { MyWebDeps } from './common/types.mjs'
import { confirm } from './lib.mjs'
import { ensureCollections } from '@moodlenet/arangodb'
import shell from './shell.mjs'
import { plugin } from '@moodlenet/react-app/server'
import { mountApp } from '@moodlenet/http-server'

await shell.call(ensureCollections)({ defs: { User: { kind: 'node' } } })

shell.call(plugin)<MyWebDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: { me, auth },
})

shell.call(mountApp)({
  getApp: function getHttpApp(express) {
    const app = express()
    app.get('/confirm-email/:token', async (req, res) => {
      const { token } = req.params
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
