import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { prepareApp } from './oauth-server'
import configApiKeyStore from './store'

export type SocialAuthTopo = {}
export type SocialAuthExt = ExtDef<'moodlenet-passport-auth', '0.1.10', SocialAuthTopo>

const ext: Ext<SocialAuthExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-passport-auth@0.1.10',
  displayName: 'passport-auth ext',
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
      const app = inst.express()
      prepareApp(shell, app)
      inst.mount({ mountApp: app })
    })
    shell.expose({
      'create/sub': { validate: () => ({ valid: true }) },
      'getAll/sub': { validate: () => ({ valid: true }) },
    })
    return {
      deploy() {
        const store = configApiKeyStore({ folder: resolve(__dirname, '..', '.ignore', 'userStoreApiKey') })
        shell.lib.pubAll<SocialAuthExt>('moodlenet-passport-auth@0.1.10', shell, {
          async getAll(){
            return await store.getAll()
          },
          async save(_:any){
            return await store.save(_.msg.data.req)
          }
        })
        return {}
      },
    }
  },
}

export default { exts: [ext] }
