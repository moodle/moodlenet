import { ensureCollections } from '@moodlenet/arangodb'
import { expose as auth } from '@moodlenet/authentication-manager'
import { mountApp } from '@moodlenet/http-server'
import { plugin } from '@moodlenet/react-app/server'
import { MyWebDeps } from './common/types.mjs'
import { expose as me } from './expose.mjs'
import { confirm } from './lib.mjs'
import shell from './shell.mjs'

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
