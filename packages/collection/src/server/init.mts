
import { mountApp } from '@moodlenet/http-server/server'
import { shell } from './shell.mjs'

export const env = getEnv(shell.config)

shell.call(mountApp)({
  getApp(express) {
    const app = express()
    // app.use('/oauth-authorization-server', (_req, res) => res.json({ a: 1 }))
    app.use('/test/', ()=>'test')
    return app
  },
  mountOnAbsPath: '/',
})

function getEnv(_: any): Env {
  return {
    __: _,
  }
}
export type Env = { __?: unknown }
