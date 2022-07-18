import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { prepareApp } from './oauth-server'

export type SocialAuthTopo = {}
export type SocialAuthExt = ExtDef<'moodlenet-passport-auth', '0.1.10', SocialAuthTopo>

const ext: Ext<SocialAuthExt, [CoreExt, ReactAppExt]> = {
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
      const app = inst.express()
      prepareApp(shell, app)
      inst.mount({ mountApp: app })
    })
    shell.expose({})
    return {
      deploy() {
        shell.lib.pubAll<SocialAuthExt>('moodlenet-passport-auth@0.1.10', shell, {})
        return {}
      },
    }
  },
}

export default { exts: [ext] }
