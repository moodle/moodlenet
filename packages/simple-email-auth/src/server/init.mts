import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { expose as auth } from '@moodlenet/authentication-manager/server'
import { mountApp, sendAuthTokenCookie } from '@moodlenet/http-server/server'
import { plugin } from '@moodlenet/react-app/server'
import { MyWebDeps } from '../common/types.mjs'
import { expose as me } from './expose.mjs'
import { confirm } from './lib.mjs'
import { shell } from './shell.mjs'
import { EmailPwdUserData } from './store/types.mjs'

export const { db } = await shell.call(getMyDB)()
export const { collection: EmailPwdUserCollection /* ,newlyCreated */ } = await shell.call(
  ensureDocumentCollection,
)<EmailPwdUserData>('EmailPwdUser')

shell.call(plugin)<MyWebDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: { me, auth },
})

shell.call(mountApp)({
  getApp: function getHttpApp(express) {
    const app = express()
    app.get('/confirm-email/:token', async (req, res) => {
      const { token } = req.params
      const confirmResp = await confirm({ token }).catch(e => {
        console.log(e)
        res.status(500).send(e)
        throw e
      })
      if (!confirmResp.success) {
        res.status(400).end(confirmResp.msg)
        return
      }
      sendAuthTokenCookie(res, confirmResp.sessionToken)
      res.redirect(`/`)
    })
    return app
  },
})
