import { AuthenticationManagerExtDef } from '@moodlenet/authentication-manager'
import type { ContentGraphExtDef } from '@moodlenet/content-graph'
import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { MNHttpServerExtDef } from '@moodlenet/http-server'
import type { ReactAppExtDef } from '@moodlenet/react-app'
import type { WebUserExtDef } from '@moodlenet/web-user'
import { resolve } from 'path'
import { prepareApp } from './oauth-server'
import configApiKeyStore from './store'
import { PassportConfigs } from './store/types'

export type PassportAuthTopo = {
  get: SubTopo<void, { configs: PassportConfigs }>
  save: SubTopo<{ configs: PassportConfigs }, { configs: PassportConfigs }>
}
export type PassportAuthExtDef = ExtDef<'@moodlenet/passport-auth', '0.1.0', void, PassportAuthTopo>
export type PassportAuthExt = Ext<
  PassportAuthExtDef,
  [CoreExt, ReactAppExtDef, MNHttpServerExtDef, AuthenticationManagerExtDef, ContentGraphExtDef, WebUserExtDef]
>

const ext: PassportAuthExt = {
  name: '@moodlenet/passport-auth',
  version: '0.1.0',
  requires: [
    '@moodlenet/core@0.1.0',
    '@moodlenet/react-app@0.1.0',
    '@moodlenet/http-server@0.1.0',
    '@moodlenet/authentication-manager@0.1.0',
    '@moodlenet/content-graph@0.1.0',
    '@moodlenet/web-user@0.1.0',
  ],
  connect(shell) {
    const [, reactApp, http] = shell.deps
    reactApp.plug.setup({
      mainComponentLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainModule.tsx'),
    })
    return {
      deploy() {
        // by etto http://localhost:3000/_/@moodlenet/passport-auth/auth/me/
        http.plug.mount({ getApp })
        function getApp() {
          const app = http.plug.express()
          prepareApp(shell, app)
          return app
        }

        shell.expose({
          'save/sub': { validate: () => ({ valid: true }) },
          'get/sub': { validate: () => ({ valid: true }) },
        })

        const store = configApiKeyStore({ folder: resolve(__dirname, '..', '.ignore', 'userStoreApiKey') })
        shell.provide.services({
          async get() {
            const configs = await store.read()
            return { configs }
          },
          async save({ configs: configsPatch }) {
            const configs = await store.patchConfigs(configsPatch)
            return { configs }
          },
        })
        return {}
      },
    }
  },
}

export default ext
