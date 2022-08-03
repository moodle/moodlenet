import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { prepareApp } from './oauth-server'
import configApiKeyStore from './store'
import { PassportConfigs } from './store/types'

export type PassportAuthTopo = {
  get: SubTopo<void, { configs: PassportConfigs }>
  save: SubTopo<{ configs: PassportConfigs }, { configs: PassportConfigs }>
}
export type PassportAuthExt = ExtDef<'@moodlenet/passport-auth', '0.1.0', PassportAuthTopo, void, void>

const ext: Ext<PassportAuthExt, [CoreExt, ReactAppExt]> = {
  name: '@moodlenet/passport-auth',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  wireup(shell) {
    shell.plugin<ReactAppExt>('@moodlenet/react-app@0.1.0', plug => {
      console.log(`@moodlenet/passport-auth: plugin<ReactAppExt>`, plug)
      plug.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'routes.tsx'),
        },
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
        },
      })
    })
    // by etto http://localhost:3000/_/@moodlenet/passport-auth/auth/me/
    shell.plugin<MNHttpServerExt>('@moodlenet/http-server@0.1.0', plug => {
      plug.mount({ getApp })
      function getApp() {
        const app = plug.express()
        prepareApp(shell, app)
        return app
      }
    })
    shell.expose({
      'save/sub': { validate: () => ({ valid: true }) },
      'get/sub': { validate: () => ({ valid: true }) },
    })
    return {
      deploy() {
        const store = configApiKeyStore({ folder: resolve(__dirname, '..', '.ignore', 'userStoreApiKey') })
        shell.provide.services({
          async get() {
            const configs = await store.read()
            return { configs }
          },
          async save({
            msg: {
              data: {
                req: { configs: configsPatch },
              },
            },
          }) {
            const configs = await store.patchConfigs(configsPatch)
            return { configs }
          },
        })
        return
      },
    }
  },
}

export default ext
