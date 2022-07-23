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
export type PassportAuthExt = ExtDef<'moodlenet-passport-auth', '0.1.10', PassportAuthTopo>

const ext: Ext<PassportAuthExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-passport-auth@0.1.10',
  displayName: 'Passport Auth',
  description: 'Use external authentication systems',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-passport-auth: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'routes.tsx'),
        },
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
        },
      })
    })
    // by etto http://localhost:3000/_/moodlenet-passport-auth/auth/me/
    shell.onExtInstance<MNHttpServerExt>('moodlenet-http-server@0.1.10', inst => {
      inst.mount({ getApp })
      function getApp() {
        const app = inst.express()
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
        shell.lib.pubAll<PassportAuthExt>('moodlenet-passport-auth@0.1.10', shell, {
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
        return {}
      },
    }
  },
}

export default { exts: [ext] }
