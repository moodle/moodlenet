import { instanceDomain } from '@moodlenet/core'
import { mountApp } from '@moodlenet/http-server/server'
import kvStoreFactory from '@moodlenet/key-value-store/server'
import Provider from 'oidc-provider'
import { getProviderConfig } from './oidc-provider.mjs'
import { shell } from './shell.mjs'
import { OpenIdKeyValueData } from './types/storeTypes.mjs'
// import { DataType } from './types/storeTypes.mjs'

export * from './lib.mjs'
export * from './types/asyncCtxTypes.mjs'

export const kvStore = await kvStoreFactory<OpenIdKeyValueData>(shell)

shell.call(mountApp)({
  getApp(express) {
    const app = express()
    const providerConfig = getProviderConfig(kvStore)

    setupDiscoveryProvider()
    setupOpenIdProvider()

    return app

    function setupOpenIdProvider() {
      const openidProvider = new Provider(instanceDomain, providerConfig)
      openidProvider.use((ctx, next) => {
        ctx.path = ctx.path.replace(/^\/\.openid/, '')
        return next()
      })
      app.all('/.openid/*', openidProvider.callback())
    }

    function setupDiscoveryProvider() {
      const wellKnownProvider = new Provider(instanceDomain, providerConfig)
      wellKnownProvider.use((ctx, next) => {
        ctx.path = '/.well-known/openid-configuration'
        return next()
      })
      app.get(
        '/.well-known/((oauth-authorization-server)|(openid-configuration))',
        (request, _res, next) => {
          request.baseUrl = '/.openid'
          next()
        },
        wellKnownProvider.callback(),
      )
    }
  },
  mountOnAbsPath: '/',
})

// export const env = getEnv(shell.config)
// function getEnv(_: any): Env {
//   return {
//     __: _,
//   }
// }
// export type Env = { __?: unknown }
