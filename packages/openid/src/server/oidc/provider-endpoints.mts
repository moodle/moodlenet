import { mountApp } from '@moodlenet/http-server/server'
import { shell } from '../shell.mjs'

shell.call(mountApp)({
  async getApp(express) {
    const { discoveryProvider, openIdProvider } = await import('./provider.mjs')
    const app = express()

    app.get(
      '/.well-known/((oauth-authorization-server)|(openid-configuration))',
      (request, _res, next) => {
        request.baseUrl = '/.openid'
        next()
      },
      discoveryProvider.callback(),
    )
    app.all('/.openid/*', openIdProvider.callback())

    return app
  },
  mountOnAbsPath: '/',
})
