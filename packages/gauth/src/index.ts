import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { prepareApp } from './oauth-server'

export type SocialAuthTopo = {}
export type SocialAuthExt = ExtDef<'moodlenet-gauth', '0.1.10', SocialAuthTopo>

const ext: Ext<SocialAuthExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-gauth@0.1.10',
  displayName: 'gauth ext',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-gauth: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'routes.tsx'),
        },
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
        },
      })
    })
    // by etto http://localhost:3000/_/moodlenet-gauth/auth/me/
    shell.onExtInstance<MNHttpServerExt>('moodlenet-http-server@0.1.10', inst => {
      const app = inst.express()
      prepareApp(app)
      inst.mount({ mountApp: app })
    })
    shell.expose({})
    return {
      deploy() {
        shell.lib.pubAll<SocialAuthExt>('moodlenet-gauth@0.1.10', shell, {})
        return {}
      },
    }
  },
}

export default { exts: [ext] }
