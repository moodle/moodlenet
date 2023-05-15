import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { mountApp } from '@moodlenet/http-server/server'
import { plugin } from '@moodlenet/react-app/server'
import type { MyWebDeps } from '../common/types.mjs'
import { expose as me } from './expose.mjs'
import { confirm } from './lib.mjs'
import { shell } from './shell.mjs'
import type { EmailPwdUserData } from './store/types.mjs'

export const { db } = await shell.call(getMyDB)()
export const { collection: EmailPwdUserCollection /* ,newlyCreated */ } = await shell.call(
  ensureDocumentCollection,
)<EmailPwdUserData>('EmailPwdUser')

shell.call(plugin)<MyWebDeps>({
  initModuleLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: { me },
})

shell.call(mountApp)({
  getApp: function getHttpApp(express) {
    const app = express()
    app.get('/confirm-email/:confirmToken', async (req, res) => {
      const { confirmToken } = req.params
      const confirmResp = await confirm({ confirmToken }).catch(e => {
        console.log(e)
        res.status(500).send(e)
        throw e
      })
      if (!confirmResp.success) {
        res.status(400).end(confirmResp.msg)
        return
      }
      res.redirect(`/`)
    })
    return app
  },
})
